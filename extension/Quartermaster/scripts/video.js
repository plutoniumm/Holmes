const app = { speed: 1.6, AllVids: undefined }
app.findVideos = ( doc, videos ) => {
    app.AllVids.push( ...Array.prototype.slice.call( doc.getElementsByTagName( 'video' ) ) );
    let iframes = doc.getElementsByTagName( 'iframe' );
    if ( iframes.length > 0 ) for ( const iframe of iframes ) if ( iframe.src === "" ) app.findVideos( iframe.contentDocument, videos );
}
app.maintain_speed = () => {
    if ( app.AllVids ) for ( const vd of app.AllVids ) vd.playbackRate = +app.speed.toFixed( 1 );
    document.getElementById( 'QM-speed' ).innerText = app.speed.toFixed( 1 );
}
app.setup = () => {
    app.AllVids = []; app.findVideos( document, app.AllVids );
    if ( !document.body.getAttribute( 'data-qm' ) ) {
        document.body.setAttribute( 'data-qm', 1 )
        if ( app.AllVids !== undefined ) {
            document.addEventListener( "keydown", ( e ) => {
                if ( document.activeElement.tagName.toUpperCase() != 'INPUT' )
                    switch ( e.keyCode ) {
                        case 68: // d
                            app.speed += 0.2;
                            app.maintain_speed();
                            break;
                        case 83: // s
                            app.speed -= 0.2;
                            app.maintain_speed();
                            break;
                        case 65: // a
                            app.speed = 1.0;
                            app.maintain_speed();
                            break;
                        case 101: // e
                            for ( const vd of app.AllVids ) vd.currentTime = vd.duration;
                            break;
                        case 48:
                        case 49:
                        case 50:
                        case 51:
                        case 52:
                        case 53:
                        case 54:
                        case 55:
                        case 56:
                        case 57:
                            for ( const vd of app.AllVids ) vd.currentTime = ~~( ( ( +e.key ) / 10 ) * vd.duration );
                            break;
                    }
            } )
        }
    }
    if ( document.querySelector( 'video' ) ) app.speed = document.querySelector( 'video' ).playbackRate || 1.6;
}
setInterval( app.setup, 2000 )
app.maintain_speed()