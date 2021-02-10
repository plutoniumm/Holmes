export const sourcer = ( src ) => {
    if ( src == "DC++" ) return "DCpp";
    if ( src == "AppleTV+" ) return "Apple";
    if ( src == "PrimeVideo" ) return "Amazon";
    if ( src == "Hotstar" ) return "Disney";
    if ( src == "KissMovies" || src == "KissAnime" ) return "Web";
    else return src;
};

export const histSearch = ( show, state ) => {
    // GRADE
    if ( state.charAt( 0 ) == ">" ) return +show.grade > state.charAt( 1 ) ? 1 : 0;
    if ( state.charAt( 0 ) == "<" ) return +show.grade < state.charAt( 1 ) ? 1 : 0;

    // DATE
    if ( state.split( " " )[ 0 ] == "since" && +( state.split( " " )[ 1 ] ) > 1.9e3 ) return +show.release >= +( state.split( " " )[ 1 ] ) ? 1 : 0;
    if ( state.split( " " )[ 0 ] == "till" && +( state.split( " " )[ 1 ] ) > 1.9e3 ) return +show.release <= +( state.split( " " )[ 1 ] ) ? 1 : 0;

    return ( (
        show.record.toLowerCase().includes( state ) ||
        show.source.toLowerCase().includes( state ) ||
        show.type.toLowerCase().includes( state ) )
        ? 1 : 0 );
}