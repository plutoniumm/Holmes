const lier = ( idd = '', cls = '', onclk = '' ) => `<li class="QMmenu-item ${ cls }" id="${ idd }" onclick="${ onclk }"><div class="a">`, lic = `</div></li>`; let q = document.createElement( "qnav" );
q.setAttribute( 'id', 'QMmenu' );
q.setAttribute( 'class', 'QMmenu' );
q.innerHTML = `<canvas id="downcanvas" width="1px" height="1px" style="opacity:0;pointer-events:none;position:fixed;" class="playable-canvas"></canvas><input class="QMmenu-toggler" id="QMmenu-toggler" type="checkbox"></input><label for="QMmenu-toggler"></label><ul>
                ${ lier() }浪人${ lic }
                ${ lier( '', '', "window.location.href += '?bar=1'" ) }Ꞡ${ lic }
                ${ lier( 'QM-speed' ) }${ lic }
                ${ lier( '', '', "window.location.href = document.querySelector('iframe').src" ) }IF${ lic }
                ${ lier() }5${ lic }
                ${ lier() }6${ lic }
            </ul>`;

setInterval
    ( () => !document.querySelector( '.QMmenu' ) ? document.body.appendChild( q ) : null, 2e3 );


function prepPics () {
    [ ...document.getElementsByTagName( 'img' ) ].forEach( el => {
        if ( !el.getAttribute( 'Q-watch' ) ) {
            el.parentElement.parentElement.addEventListener( "mouseover", () => {
                document.getElementById( 'Q-img' ).src = el.src;
                const src = document.getElementById( 'Q-img' ).src;
                var img = new Image();
                img.crossOrigin = 'anonymous';
                const canvas = document.getElementById( "downcanvas" );
                img.onload = () => {
                    canvas.width = img.width; canvas.height = img.height;
                    const ctx = canvas.getContext( "2d" ); ctx.drawImage( img, 0, 0 );
                }
                img.src = src;

                document.getElementById( 'Q-img' ).addEventListener( "click", () => {
                    var lnk = document.createElement( 'a' ), e;
                    lnk.download = new Date().getTime().toString() + ".jpg";
                    lnk.href = canvas.toDataURL( "image/jpeg" );
                    if ( document.createEvent ) {
                        e = document.createEvent( "MouseEvents" );
                        e.initMouseEvent( "click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null );
                        lnk.dispatchEvent( e );
                    } else if ( lnk.fireEvent ) lnk.fireEvent( "onclick" );
                } );
            } );
            el.setAttribute( 'Q-watch', true );
        }
    } );
}
window.onload = setInterval( prepPics, 3e3 );