const fetch = require( 'node-fetch' );



// fetch( 'https://twitter.com/elonmusk' ).then( res => res.text() ).then( r => console.log( r ) );



module.exports = function ( app ) {
    app.get( '/social/google/trends', ( req, res ) => {
        fetch( "https://trends.google.com/trends/trendingsearches/daily/rss?geo=US" )
            .then( ( res ) => res.text() )
            .then( ( data ) => { res.send( data ) } );
    } );
}