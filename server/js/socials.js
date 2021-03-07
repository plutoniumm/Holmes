const fetch = require( 'node-fetch' );

async function routes ( fastify, options ) {
    fastify.get( '/social/google/trends', ( req, res ) => {
        const locations = [ 'US', 'GB', 'IN' ];
        const GTBase = 'https://trends.google.com/trends/trendingsearches/daily/rss?geo=';
        Promise.all( locations.map( e => fetch( GTBase + e ) ) )
            .then( resp => Promise.all( resp.map( r => r.text() ) ) )
            .then( result => res.send( result ) );
    } );
    fastify.get( '/social/insta/trends', ( req, res ) => {
        const locations = [ 'US', 'GB', 'IN' ];
        const GTBase = 'https://trends.google.com/trends/trendingsearches/daily/rss?geo=';
        Promise.all( locations.map( e => fetch( GTBase + e ) ) )
            .then( resp => Promise.all( resp.map( r => r.text() ) ) )
            .then( result => res.send( result ) );
    } );
}
module.exports = routes;