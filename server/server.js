const express = require( 'express' );
const fs = require( 'fs' );
const app = express();
const port = process.env.PORT || 4000;

app.use( express.json() );
require( './security.js' )( app );
require( './social.js' )( app );
require( './macos.js' )( app );
app.use( '/', express.static( './public' ) );

const db = './config/database/';
const mths = [ 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC' ]

app.post( '/data/:file', ( req, res ) => {
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

app.listen( port, console.log( 'Server listening on PORT:4000' ) )