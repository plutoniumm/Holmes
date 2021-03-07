const app = require( 'fastify' )( { logger: 0 } );
const path = require( 'path' );
const fs = require( 'fs' );
const mths = [ 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC' ];
const port = process.env.PORT || 4000;
const db = './config/database/';

// app.use( express.json() );
app.register( require( './js/security' ) );
app.register( require( './js/socials' ) );
app.register( require( './js/macos' ) );

app.register( require( 'fastify-static' ), {
      root: path.join( __dirname, '../public' )
} );

app.get( '/', function ( req, res ) {
      return res.sendFile( 'index.html' );
} );

app.get( '/:file', function ( req, res ) {
      const file = req.params.file;
      const options = fs.readdirSync( 'public' ).filter( e => e.includes( '.html' ) );
      if ( options.includes( file + '.html' ) ) return res.sendFile( req.params.file + '.html' );
      else return res.sendFile( 'index.html' );
} );

app.post( '/data/:file', ( req, res ) => {
      const type = req.params.file;
      let data = fs.readFileSync( db + type + '.json', 'utf-8' );
      fs.writeFileSync( db + type + '.json', JSON.stringify( [ req.body, ...( JSON.parse( data ) ) ] ) );
      res.send( { 'status': 'Done' } );
} );

app.get( '/data/:file', ( req, res ) => {
      const which = req.params.file;
      const file = fs.readFileSync( db + which, 'utf-8' );
      res.send( file );
} );

app.post( '/log', ( req, res ) => {
      const q = req.query;
      const d = new Date();

      const file = `./config/logs/${ d.getFullYear() }${ mths[ d.getMonth() ] }.txt`;
      const log =
            `${ d.getTime() } ::${ d.toString() } ::@${ q.key } ::${ q.params };;\n`;
      fs.appendFile( file, log, ( e ) => { if ( e ) throw e } );
      res.sendStatus( 204 );
} );

app.listen( port, console.log( 'Server listening on PORT:' + port ) );