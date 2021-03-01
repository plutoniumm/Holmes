const fs = require( 'fs' );
const argv = require( 'minimist' )( process.argv.slice( 2 ) );

let run = JSON.parse( fs.readFileSync( './meta/run.json', 'utf-8' ) );

let apps = argv._;
let esm;

if ( apps.includes( 'admin' ) ) {
    esm = [ 'admin' ];
    apps = apps.filter( e => e !== 'admin' );
}

iife = apps;
const active = { "iife": iife, 'esm': esm || [] };
run.rollup = active;

fs.writeFileSync( './meta/run.json', JSON.stringify( active ) );