let q = document.createElement( "qnav" );
q.setAttribute( 'id', 'QMmenu' );
q.setAttribute( 'class', 'QMmenu' );
q.innerHTML = `<canvas id="downcanvas" width="1px" height="1px" style="opacity:0;pointer-events:none;position:fixed;"
        class="playable-canvas"></canvas><input class="QMmenu-toggler" id="QMmenu-toggler" type="checkbox"></input><label for="QMmenu-toggler"></label><ul>
        <li class="QMmenu-item"><img src="" id="Q-img" data-cmd="download" class="a" alt="浪人"/></li>
        <li class="QMmenu-item"><div class="a" data-cmd="gbar">Ꞡ</div></li>
        <li class="QMmenu-item" id="QM-speed"><div class="a">1.0</div></li>
        <li class="QMmenu-item"><div class="a" data-cmd="iframe">iF</div></li>
        <li class="QMmenu-item"><div class="a" data-cmd="top">↑</div></li>
        <li class="QMmenu-item"><div class="a">-</div></li>`;

setInterval
    ( () => {
        if ( !document.querySelector( '.QMmenu' ) ) {
            document.body.appendChild( q )
            document.querySelector( 'qnav ul' ).addEventListener( 'click', ( e ) => {
                const cmd = e.target;
                if ( cmd.dataset.cmd === 'gbar' ) window.location.href += '?bar=1';
                if ( cmd.dataset.cmd === 'iframe' ) window.location.href = document.querySelector( 'iframe' ).src;
                if ( cmd.dataset.cmd === 'top' ) window.scrollTo( 0, 0 );

                if ( cmd.dataset.cmd === 'download' ) {
                    var lnk = document.createElement( 'a' ), e;
                    lnk.download = new Date().getTime().toString() + ".jpg";
                    const canvas = document.getElementById( "downcanvas" );
                    lnk.href = canvas.toDataURL( "image/jpeg" );
                    if ( document.createEvent ) {
                        e = document.createEvent( "MouseEvents" );
                        e.initMouseEvent( "click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null );
                        lnk.dispatchEvent( e );
                    } else if ( lnk.fireEvent ) lnk.fireEvent( "onclick" );
                };
            } )
        }
    }, 2e3 );

function prepPics () {
    if ( ( document.querySelectorAll( '[Q-watch="true"]' ).length - document.querySelectorAll( 'img' ).length ) !== 0 ) {
        [ ...document.querySelectorAll( 'img' ) ].forEach( el => {
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
                } );
                el.setAttribute( 'Q-watch', true );
            }
        } );
    }
}
window.onload = setInterval( prepPics, 3e3 );