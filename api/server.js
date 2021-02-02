const { exec } = require( "child_process" );
const express = require( 'express' );
const fs = require( 'fs' );
const app = express();
const port = process.env.PORT || 4000;
const osascript = require( 'node-osascript' );

app.use( express.json() );
app.use( '/', express.static( './public' ) );

const db = './config/database/';
const mths = [ 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC' ]

app.post( '/json/:file', ( req, res ) => {
      const type = req.params.file;
      let data = fs.readFileSync( db + type + '.json', 'utf-8' );
      fs.writeFileSync( db + type + '.json', JSON.stringify( [ req.body, ...( JSON.parse( data ) ) ] ) );
      res.send( { 'status': 'Done' } );
} );

app.get( '/data/:file', ( req, res ) => {
      const which = req.params.file;
      const file = fs.readFileSync( db + which, 'utf-8' );
      res.send( file )
} )

app.post( '/log', ( req, res ) => {
      const q = req.query;
      const d = new Date();
      // ADD LOG
      const file = `./config/logs/${ d.getFullYear() }${ mths[ d.getMonth() ] }.txt`;
      const log =
            `${ d.getTime() } ::${ d.toString() } ::@${ q.key } ::${ q.params };;\n`;
      fs.appendFile( file, log, ( e ) => { if ( e ) throw e } );
      res.sendStatus( 204 );
} )

app.post( '/sys', ( req, res ) => {
      const q = req.query;
      if ( q.app == 'system' ) {
            console.log( q );
            if ( q.cmd == 'volume' ) {
                  osascript.execute( `set volume output volume ${ q.params }`, ( err, result, raw ) => {
                        if ( err ) res.sendStatus( 400 ); return;
                  } );
            }
            if ( q.cmd == 'volState' ) osascript.execute( `output volume of (get volume settings)`, ( err, result, raw ) => ( res.send( { 'cmd': 'volState', 'data': result } ) ) );
      }
      if ( q.app == 'music' ) {
            if ( q.cmd == 'musicState' ) exec( 'osascript ./api/music.scpt', ( err, sto, sterr ) => ( res.send( { 'cmd': 'musicState', 'data': sto.split( ', ' ) } ) ) );

            if ( q.cmd == 'playpause' ) exec( `osascript -e 'tell application "Music" to playpause'`, ( err, sto, sterr ) => null );
      }

      if ( q.app == 'reminders' ) {
            console.log( q );
            let reminders = [];
            exec( `osascript -e ' tell application "Reminders"
            set mylist to id of list "${ q.params || 'Stack' }"
            set reminderList to[]
            set reminderList to name of reminders whose id of container is mylist
            quit
            return reminderList
            end tell'`, ( err, sto, sterr ) => {
                  if ( err ) return console.log( err );
                  if ( sterr ) return console.log( sterr )
                  reminders = [ ...sto.split( ', ' ).map( e => { return { "list": e.trim(), "notes": [] } } ) ];
                  exec( `osascript -e ' tell application "Reminders"
                  set mylist to id of list "${ q.params || 'Stack' }"
                  set reminderList to[]
                  set reminderList to body of reminders whose id of container is mylist
                  quit
                  return reminderList
                  end tell'`, ( err, sto, sterr ) => {
                        if ( err ) return console.log( err );
                        if ( sterr ) return console.log( sterr );
                        let stoes = sto.split( ', ' )
                        reminders.forEach( ( e, i ) => ( e.notes = [ ...( stoes[ i ].split( '\n' ) ) ] ) )
                        res.send( { 'cmd': 'reminders', 'data': reminders } );
                  } );
            } );
      }
} );

app.listen( port, console.log( 'Server listening on PORT:4000' ) )