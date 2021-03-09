const googleTrends = require( 'google-trends-api' );

googleTrends.dailyTrends( {
    geo: 'US',
}, ( err, res ) => {
    if ( err ) console.log( err );
    console.log( res );
} );