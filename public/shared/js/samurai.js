import sites from "../../../config/sites.json";

const suggestions = ( SIn ) => {
    const sc_Old = document.getElementById( "suggestions" );
    if ( sc_Old ) sc_Old.remove();
    let sc = document.createElement( "script" );
    sc.src = `https://clients1.google.com/complete/search?client=youtube&hl=en&q=${ SIn }&jsonp=returnSug`;
    sc.id = "suggestions";
    document.body.appendChild( sc );
};

const setEngineImage = ( key ) => {
    const engineImage = find( '#engineImage' );
    if ( engineImage ) engineImage.src = `./icons/${ sites[ key ].name }.svg`
}

export const engine = ( input ) => {

    if ( input ) {
        setEngineImage( 'root' );
        if ( input.charAt( 0 ) === '!' ) {
            const withBang = input.replace( '!', '' );
            let // blanks
                query,
                key;

            if ( sites.hasOwnProperty( withBang.split( ':' )[ 0 ] ) ) {
                key = withBang.split( ':' )[ 0 ];
                query = withBang.replace( key + ':', '' );
                setEngineImage( key );
                if ( query ) suggestions( query );
                return { key: key, query: query, url: sites[ key ][ query ] };
            }

            if ( sites.hasOwnProperty( withBang.split( ' ' )[ 0 ] ) ) {
                key = withBang.split( ' ' )[ 0 ];
                query = withBang.replace( key + ' ', '' );
                if ( query ) suggestions( query );
                setEngineImage( key );
                return { key: key, query: query, url: ( sites[ key ].prelink + encodeURIComponent( query ) + ( sites[ key ].postlink || '' ) ) };
            }
        }
        else suggestions( input );
        return { key: 's', query: input, url: ( sites[ 's' ].prelink + encodeURIComponent( input ) + ( sites[ 's' ].postlink || '' ) ) };;
    }
}

export const preprocessor = ( { key, query, url } ) => {
    const siteFunctions = {
        r: ( q ) => {
            if ( q.charAt( 0 ) === '/' ) return sites.r.base + 'r' + q;
            else return url;
        }
    }
    if ( siteFunctions.hasOwnProperty( key ) ) return siteFunctions[ key ]( query );
    else return url;
}