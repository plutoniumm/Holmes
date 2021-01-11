import { YT_KEY } from '../../config/keys'

export const k = YT_KEY;
export const YT = 'https://youtube.googleapis.com/youtube/v3/';

export const search = ( q ) => {
    return fetch( `${ YT }search?part=snippet&key=${ k }&q=${ q }&type=video&maxResults=10` ).then( res => { return res.json(); } );
}
export const plSearch = ( q ) => {
    return fetch( `${ YT }search?part=snippet&key=${ k }&q=${ q }&type=playlist&maxResults=10` ).then( res => { return res.json(); } );
}
export const playlist = ( q, num = 50 ) => {
    return fetch( `${ YT }playlistItems?part=snippet&playlistId=${ q }&key=${ k }&maxResults=${ num }` ).then( res => { return res.json(); } )
}
export const URLpars = () => {
    const entries = new URLSearchParams( window.location.search ).entries();
    const params = {};
    for ( let entry of entries ) params[ entry[ 0 ] ] = entry[ 1 ];
    return params;
}
export const chURL = ( key, value ) => {
    let searchParams = new URLSearchParams( window.location.search );
    searchParams.set( key, value );
    let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + searchParams.toString();
    window.history.pushState( { path: newurl }, '', newurl );
}