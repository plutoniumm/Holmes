const express = require( 'express' );
const fs = require( 'fs' );
const app = express();
const port = process.env.PORT || 4000;
const osascript = require( 'node-osascript' );

app.use( '/', express.static( './public' ) );

const mths = [ 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC' ]


app.post( '/log', ( req, res ) => {
      const q = req.query
      const d = new Date();
      // ADD LOG
      const file = `./api/logs/${ d.getFullYear() }${ mths[ d.getMonth() ] }.txt`;
      const log =
            `${ d.getTime() } ::${ d.toString() } ::@${ q.key } ::${ q.params };;\n`
      fs.appendFile( file, log, ( e ) => { if ( e ) throw e } )
      res.sendStatus( 204 )
} )

app.post( '/sys', ( req, res ) => {
      const q = req.query;
      console.log( q );
      // sudo osascript -e 'set volume output volume 50'
      osascript.execute( 'set volume output volume 50', ( err, result, raw ) => {
            if ( err ) res.send( 400 ); return;
            console.log( result );
            console.log( raw );
      } );
      res.send( 200 );
} )

app.listen( port, console.log( 'Server listening on PORT:4000' ) )