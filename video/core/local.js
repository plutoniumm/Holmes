import { writable } from 'svelte/store';
import { URLpars, chURL } from "./api";

export const type = writable( 'image' );

export const typecheck = ( tp ) => {
    const tpL = tp.toLowerCase();
    if ( tpL == 'jpg' || tpL == 'png' || tpL == 'svg' ) {
        type.set( 'image' )
    }
    if ( tpL == 'mp4' || tpL == 'mkv' || tpL == 'avi' ) {
        type.set( 'video' )
    }
};