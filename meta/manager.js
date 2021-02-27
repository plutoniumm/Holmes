const fs = require( 'fs' );
const argv = require( 'minimist' )( process.argv.slice( 2 ) );

if ( argv.meta == 'pkg' ) {
    const prepkg = JSON.parse( fs.readFileSync( './prepkg.json', 'utf-8' ) );
    const pkmain = JSON.parse( fs.readFileSync( '../package.json', 'utf-8' ) );

    let deps = {}, dDeps = {};
    for ( const [ key, val ] of Object.entries( prepkg.packages ) ) {
        if ( key !== 'ronin/global' )
            Object.entries( val ).map( e => deps[ e[ 0 ] ] = e[ 1 ] );
        else
            Object.entries( val ).map( e => dDeps[ e[ 0 ] ] = e[ 1 ] );

        // console.log( val.replace( '{', '' ).replace( '}', ',' ) );
    }
    let pkgnew = pkmain;
    pkgnew.dependencies = deps;
    pkgnew.devDependencies = dDeps;
    fs.writeFileSync( '../package.json', JSON.stringify( pkgnew ) )
}