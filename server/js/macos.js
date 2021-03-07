const { exec } = require( "child_process" );
const fs = require( 'fs' );

const dcpp = '../../../Downloads/DC++/';

const fns = {
    "smc": 'smckit',
    "rmdr": `quit
            return reminderList
            end tell'`
}

async function routes ( fastify, options ) {
    fastify.get( '/sys/fs', ( req, res ) => {
        const ur = decodeURIComponent( req.query.ur );
        const dir = fs.readdirSync( dcpp + ur ).filter( e => e.charAt( 0 ) !== '.' );
        res.send( dir );
    } );

    fastify.get( '/sys/smc', ( req, res ) => {
        exec( fns.smc, ( err, sto, sterr ) => {
            const data = sto.split( '\n' ).map( o => o.split( '\x1B[0;0m' )[ 1 ] );
            const stats = { "cpu": data[ 1 ].trim(), "board": data[ 2 ].trim(), "fan": data[ 14 ].trim() };
            res.send( stats );
        } );
    } );
};

module.exports = routes;