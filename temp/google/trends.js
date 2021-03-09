const fs = require( 'fs' )

let parser = new ( require( 'rss-parser' ) )();

parser.parseURL( 'https://www.autosport.com/rss/f1/news/' ).then( r => {
    fs.writeFileSync( './f1.json', JSON.stringify( r ) );
} );

// fetch( 'https://www.autosport.com/rss/f1/news/' ).then( res => res.text() ).then( r => console.log( r ) )