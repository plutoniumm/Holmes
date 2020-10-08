const express = require( 'express' )
const fs = require( 'fs' )
const app = express()
const port = process.env.PORT || 4000
const cors = require( 'cors' );
const { v1: uuidv1 } = require( 'uuid' );

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
            `${ uuidv1() } ::${ new Date().toString() } ::@${ q.key } ::${ q.params };;\n`
      fs.appendFile( file, log, ( e ) => { if ( e ) throw e } )

      // RECALCULATE STATS
      fs.readFile( './api/logs/stats.json', 'utf8', ( e, data ) => {
            const stats = JSON.parse( data )
            const key = q.key
            const idx = stats.stats.findIndex( p => p.key == key )
            if ( stats.buffers.today !== new Date().getDate() ) {
                  // RESOLVE PREVIOUS STATS
                  stats.stats.forEach( e => {
                        e.frequency =
                              ( ( e.frequency * e.time ) + e.buffer ) / ( ++e.time )
                        e.buffer = 0
                  } );
                  stats.buffers.today++;
            }
            stats.buffers.lastCh = new Date().getTime();
            stats.stats[ idx ].buffer++;
            stats.stats[ idx ].total = stats.stats[ idx ].frequency * stats.stats[ idx ].time + stats.stats[ idx ].buffer;
            fs.writeFile( './api/logs/stats.json', JSON.stringify( stats ), ( e ) => { if ( e ) throw e; } )
      } )
      res.sendStatus( 204 )
} )

app.get( '/log', ( req, res ) => {
      fs.readFile( './api/logs/stats.json', 'utf8', ( e, data ) => {
            res.send( data )
      } )
} )

app.listen( port, console.log( 'Server listening on PORT:4000' ) )