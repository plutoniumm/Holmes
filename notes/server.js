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

app.get( '/', ( req, res ) => {
      const id = req.params.id;
      res.view( './note.html' );
} )

app.get( '/:id', ( req, res ) => {
      const id = req.params.id;
      res.view( './note.html' );
} )

app.get( '/file/:id', ( req, res ) => {
      const id = req.params.id;
      res.send( fs.readFileSync( `./files/${ id }.txt`, 'utf-8' ) )
} )

app.post( '/:id', ( req, res ) => {
      const id = req.params.id;
      fs.writeFileSync( `./files/${ id }.txt`, req.body );
      res.send( 200 );
} )

const files = fs.readdirSync( './files/' );
console.log( files );

app.listen( port, console.log( 'Server listening on PORT:' + port ) );