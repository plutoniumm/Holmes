import { writable, get } from 'svelte/store';
import { URLpars, chURL } from "./api";

export const vId = writable( URLpars().id || "" );
export const stack = writable( JSON.parse( localStorage.getItem( URLpars().stack ) ) || [] );

export const vidoer = ( e ) => {
    vId.set( e.target.parentElement.id );
    chURL( "id", e.target.parentElement.id );
    window.scrollTo( 0, 0 );
    document.title = e.target.parentElement.dataset.title;
};

export const fullStacker = ( vids ) => {
    const temp = get( stack )
    console.log( temp );
    stack.set( [ ...temp, ...vids ] )
};
export const stacker = ( vid ) => {
    const temp = get( stack )
    console.log( temp );
    stack.set( [ ...temp, vid ] )
};
export const destacker = ( i ) => {
    stack.set( get( stack ).splice( i, 1 ) )
    const trk = new Date().getTime();
    localStorage.removeItem( URLpars().stack );
    if ( stack.length > 0 ) {
        localStorage.setItem( trk, JSON.stringify( stack ) );
        chURL( "stack", trk );
    } else chURL( "stack", "" );
};