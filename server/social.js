const fetch = require( 'node-fetch' );

// fetch( 'https://twitter.com/elonmusk' ).then( res => res.text() ).then( r => console.log( r ) );

module.exports = function ( app ) {
    app.get( '/social/google/trends', ( req, res ) => {
        const locations = [ 'US', 'GB', 'IN' ];
        const GTBase = 'https://trends.google.com/trends/trendingsearches/daily/rss?geo=';
        Promise.all( locations.map( e => fetch( GTBase + e ) ) )
            .then( resp => Promise.all( resp.map( r => r.text() ) ) )
            .then( result => res.send( result ) );
    } );
}