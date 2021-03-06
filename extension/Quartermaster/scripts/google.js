const qm = {};

qm.URLpars = () => {
    const entries = new URLSearchParams( window.location.search ).entries();
    const params = {};
    for ( let entry of entries ) params[ entry[ 0 ] ] = entry[ 1 ];
    return params;
}

if ( window.location.host.includes( 'youtube' ) ) {
    setInterval( () => {
        if ( document.getElementById( 'related' ) ) document.getElementById( 'related' ).remove();
        if ( document.getElementsByTagName( 'ytd-comments' )[ 0 ] ) document.getElementsByTagName( 'ytd-comments' )[ 0 ].remove();
    }, 3e3 );
};
if ( window.location.host == 'meet.google.com' ) {
    setInterval( () => {
        if ( !( qm.URLpars().bar ) ) document.querySelector( 'div[aria-label="Leave call"]' ).parentElement.parentElement.parentElement.remove()
    }, 1e4 );
}
