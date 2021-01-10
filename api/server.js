const express = require( 'express' )
const fs = require( 'fs' )
const app = express()
const port = process.env.PORT || 4000
const cors = require( 'cors' );

app.use( cors() );
app.options( '*', cors() );
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

app.listen( port, console.log( 'Server listening on PORT:4000' ) )