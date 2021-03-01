const { exec } = require( "child_process" );
const fs = require( 'fs' );


const dcpp = '../../../Downloads/DC++/';

const fns = {
    "smc": 'smckit',
    "jupyStart": 'npm run notes',
    "jupyStop": 'jupyter notebook stop',
    "rmdr": `quit
            return reminderList
            end tell'`
}

module.exports = function ( app ) {
    app.get( '/sys/fs', ( req, res ) => {
        const ur = decodeURIComponent( req.query.ur );
        const dir = fs.readdirSync( dcpp + ur ).filter( e => e.charAt( 0 ) !== '.' );
        res.send( dir )
    } );

    app.post( '/sys', ( req, res ) => {
        const q = req.query;

        if ( q.app == 'system' ) {
            if ( q.cmd == 'smc' ) exec( fns.smc, ( err, sto, sterr ) => {
                const data = sto.split( '\n' ).map( o => o.split( '\x1B[0;0m' )[ 1 ] );
                const stats = {
                    "cpu": data[ 1 ].trim(),
                    "board": data[ 2 ].trim(),
                    "fan": data[ 14 ].trim()
                }
                res.send( { 'cmd': 'MBstats', 'data': stats } )
            } );
        }

        if ( q.app == 'jupyter' ) {
            if ( q.cmd == 'start' ) exec( fns.jupyStart, ( err, sto, sterr ) => null );

            if ( q.cmd == 'stop' ) exec( fns.jupyStop, ( err, sto, sterr ) => null );
        }

        if ( q.app == 'reminders' ) {
            let reminders = [];
            exec( `osascript -e ' tell application "Reminders"
            set mylist to id of list "${ q.params || 'Stack' }"
            set reminderList to[]
            set reminderList to name of reminders whose id of container is mylist
            ${ fns.rmdr }`, ( err, sto, sterr ) => {
                if ( err ) return console.log( err );
                if ( sterr ) return console.log( sterr )
                reminders = [ ...sto.split( ', ' ).map( e => { return { "list": e.trim(), "notes": [] } } ) ];
                exec( `osascript -e ' tell application "Reminders"
                  set mylist to id of list "${ q.params || 'Stack' }"
                  set reminderList to[]
                  set reminderList to body of reminders whose id of container is mylist
                  ${ fns.rmdr }`, ( err, sto, sterr ) => {
                    if ( err ) return console.log( err );
                    if ( sterr ) return console.log( sterr );
                    let stoes = sto.split( ', ' )
                    reminders.forEach( ( e, i ) => ( e.notes = [ ...( stoes[ i ].split( '\n' ) ) ] ) )
                    res.send( { 'cmd': 'reminders', 'data': reminders } );
                } );
            } );
        }
    } );
}