const express = require( 'express' );
const cors = require( 'cors' );
// const pg = require( 'pg' );
const app = express();
const pool = require( './db' );

app.listen( 4001, console.log( 'Server listening on PORT:' + 4001 ) );


app.use( cors() );
app.use( express.json() );
// app.use( express.text() )



// ROUTES

// Create a movie
// fetch('http://localhost:4001/json/movies', {method: 'post',headers:{'Content-Type':'application/json'},body:'{"source":"KissAnime"}'}).then(res=>res.json()).then(r=>console.log(r));
app.post( "/json/movies", async ( req, res ) => {
    try {
        const { source } = req.body;
        const newMovie = await pool.query(
            "INSERT INTO movies (source) values($1) RETURNING *",
            [ source ]
        );
        res.json( newMovie.rows[ 0 ] );
    } catch ( e ) { console.error( e.message ) }
} );

// Get all movies
app.get( "/json/movies", async ( req, res ) => {
    try {
        const movies = await pool.query( "SELECT * FROM movies" );
        res.json( movies.rows );
    } catch ( e ) { console.error( e.message ) }
} );

// Get a movie
app.get( "/json/movies/:id", async ( req, res ) => {
    try {
        const { id } = req.params;
        const movie = await pool.query( "SELECT * FROM movies WHERE mov_id = ($1)", [ id ] );
        res.json( movie.rows[ 0 ] );
    } catch ( e ) { console.error( e.message ) }
} );

// Update a movie
app.put( "/json/movies/:id", async ( req, res ) => {
    try {
        const { id } = req.params;
        const { source } = req.body;
        const upd = await pool.query(
            "UPDATE movies SET source = $1 WHERE mov_id = $2",
            [ source, id ]
        );
        res.json( "Todo was updated" );
    } catch ( e ) { console.error( e.message ) }
} );

// Delete a movie
app.delete( "/json/movies/:id", async ( req, res ) => {
    try {
        const { id } = req.params;
        const del = await pool.query(
            "DELETE FROM movies WHERE mov_id = $1",
            [ id ]
        );
        res.json( "Todo was deleted" );
    } catch ( e ) { console.error( e.message ) }
} );