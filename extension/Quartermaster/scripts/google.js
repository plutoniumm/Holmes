setInterval( () => {
    if ( document.getElementById( 'related' ) ) document.getElementById( 'related' ).remove();
    if ( document.getElementsByTagName( 'ytd-comments' )[ 0 ] ) document.getElementsByTagName( 'ytd-comments' )[ 0 ].remove();
}, 1000 );