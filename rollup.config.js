import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import json from "@rollup/plugin-json";
import preprocess from 'svelte-preprocess';
import run from './meta/run.json';

const production = !process.env.ROLLUP_WATCH;
const settings = [
	resolve( { browser: true, dedupe: [ 'svelte' ] } ),
	commonjs(),
	!production && serve(),
	!production && livereload( 'public' ),
	production && terser(),
	json()
]

function serve () {
	let server;
	function toExit () { if ( server ) server.kill( 0 ); }
	return {
		writeBundle () {
			if ( server ) return;
			server = require( 'child_process' ).spawn( 'npm', [ 'run', 'start', '--', '--dev' ], {
				stdio: [ 'ignore', 'inherit', 'inherit' ], shell: true
			} );
			process.on( 'SIGTERM', toExit );
			process.on( 'exit', toExit );
		}
	};
}

export default [
	...( run.iife.map( e => ( {
		input: e + '/main.js',
		output: { sourcemap: false, format: 'iife', name: 'app', file: `public/bundles/${ e }.js` },
		plugins: [
			svelte( { dev: !production, css: css => { css.write( e + '.css' ); }, preprocess: preprocess() } ),
			...settings
		]
	} )
	) ),
	...( run.esm.map( e => ( {
		input: e + '/main.js',
		output: { sourcemap: false, format: 'esm', name: 'app', dir: `public/${ e }/` },
		plugins: [
			svelte( { dev: !production, css: css => { css.write( 'bundle.css' ); }, preprocess: preprocess() } ),
			...settings
		]
	} )
	) )
];
