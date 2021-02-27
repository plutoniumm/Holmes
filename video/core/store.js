import { writable, get } from 'svelte/store';
import { URLpars, chURL } from "./api";

export const vId = writable( URLpars().id || "" );
export const stack = writable( JSON.parse( localStorage.getItem( URLpars().stack ) ) || [] );

export const vidoer = ( e ) => {
    vId.set( e.target.parentElement.id );
    chURL( "id", get( vId ) );
    window.scrollTo( 0, 0 );
    document.title = e.target.parentElement.dataset.title;
};

export const fullStacker = ( vids ) => {
    const temp = get( stack )
    stack.set( [ ...temp, ...vids ] )
};
export const stacker = ( vid ) => {
    const temp = get( stack )
    stack.set( [ ...temp, vid ] )
};
export const destacker = ( i ) => {
    get( stack ).splice( i, 1 );
    stack.set( [ ...get( stack ) ] );
    const trk = new Date().getTime();
    localStorage.removeItem( URLpars().stack );
    if ( stack.length > 0 ) {
        localStorage.setItem( trk, JSON.stringify( get( stack ) ) );
        chURL( "stack", trk );
    } else chURL( "stack", "" );
};