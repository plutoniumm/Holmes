const app = require( 'fastify' )( { logger: 0 } );
const path = require( 'path' );
const fs = require( 'fs' );

// app.register( require( 'fastify-cors' ), {} )
// app.register( require( 'fastify-static' ), { root: path.join( __dirname, '../public' ) } );
app.register( require( 'point-of-view' ), { engine: { ejs: require( 'ejs' ) } } )

const port = process.env.PORT || 4001;
// const mths = [ 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC' ];

// ROUTES

// ( Math.random() * 1e18 ).toString( 32 )

app.get( '/:id', ( req, reply ) => {
      reply.view( './note.html', { text: fs.readFileSync( './files/' + id, 'utf-8' ) } )
} )

const files = fs.readdirSync( './files/' );
console.log( files );
// app.get( '/',  ( req, res )=> {
// } );

app.listen( port, console.log( 'Server listening on PORT:' + port ) );