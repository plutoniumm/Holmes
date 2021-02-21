onMount( () => {
    let l = [ 255, 255, 0 ],
        m = [ 0, 255, 255 ],
        r = [ 255, 0, 255 ],
        state = 0;
    let el = magic.parentElement;

    var tick = () => {
        if ( +el.style.opacity < 1 )
            el.style.opacity = +el.style.opacity + 0.02;

        if ( state == 0 ) {
            l[ 0 ] -= 1;
            l[ 2 ] += 1;
            m[ 1 ] -= 1;
            m[ 0 ] += 1;
            r[ 2 ] -= 1;
            r[ 1 ] += 1;
            if ( l[ 0 ] == 0 && m[ 0 ] == 255 ) state = 1;
        }
        if ( state == 1 ) {
            l[ 1 ] -= 1;
            l[ 0 ] += 1;
            m[ 2 ] -= 1;
            m[ 1 ] += 1;
            r[ 0 ] -= 1;
            r[ 2 ] += 1;
            if ( l[ 0 ] == 255 && m[ 0 ] == 255 ) state = 2;
        }
        if ( state == 2 ) {
            l[ 2 ] -= 1;
            l[ 1 ] += 1;
            m[ 0 ] -= 1;
            m[ 2 ] += 1;
            r[ 1 ] -= 1;
            r[ 0 ] += 1;
            if ( l[ 0 ] == 255 && m[ 0 ] == 0 ) state = 0;
        }
        requestAnimationFrame( tick ) || setTimeout( tick, 1 );

        el.style.borderImageSource = `linear-gradient(to right,rgb(${ l.join(
            ","
        ) }), rgb(${ m.join( "," ) }), rgb(${ r.join( "," ) }))`;
    };
    tick();
} );