const fetch = require( 'node-fetch' );

module.exports = function ( app ) {
    app.get( '/social/google/trends', ( req, res ) => {
        fetch( "https://trends.google.com/trends/trendingsearches/daily/rss?geo=US" )
            .then( ( res ) => res.text() )
            .then( ( data ) => { res.send( data ) } );
    } );
}