var http = require( "http" );

var options = {
      host: 'https://clients1.google.com',
      // port: 80,
      path: '/complete/search?client=firefox&hl=en&q=Apple',
      method: 'GET'
};

var req = http.request( options, ( res ) => {
      res.setEncoding( 'utf8' );
      res.on( 'data', ( bod ) => {
            console.log( bod );
      } );
} );

req.on( 'error', ( e ) => { console.log( e ); } );

// write data to request body
req.write( 'data\n' );
req.write( 'data\n' );
req.end();