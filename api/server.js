const express = require( 'express' )
const fs = require( 'fs' )
const app = express()
var exec = require( 'child_process' ).exec;
const port = process.env.PORT || 4000
// const cors = require( 'cors' );
// const bodyParser = require( 'body-parser' );
// const { v1: uuidv1 } = require( 'uuid' );

// app.use( bodyParser.json() );
// app.use( cors() );
// app.options( '*', cors() );
app.use( '/', express.static( './public' ) );
// app.use( express.json() )
app.listen( port, () => console.log( `Server Running at http://localhost:${ port }` ) )