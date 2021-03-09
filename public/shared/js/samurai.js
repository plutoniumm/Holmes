const sites = JSON.parse( `{"root":{"name":"Basic"},"nf":{"name":"Netflix","prelink":"https://www.netflix.com/search?q="},"be":{"name":"Behance","prelink":"https://www.behance.net/search?search="},"git":{"name":"Github","prelink":"https://github.com/search?&q=","me":"https://github.com/plutoniumm?tab=repositories","new":"https://github.com/new","settings":"https://github.com/settings/profile","notifs":"https://github.com/notifications?query=is%3Aunread"},"qm":{"name":"q","json":"/json","debug":"/debug","social":"/social","secure":"/secure","tasks":"/tasks"},"s":{"name":"q","prelink":"https://eu.startpage.com/sp/search?query=","postlink":"&abp=-1&t=blak&cat=web&sc=HYapiSX53sGA20&abp=-1"},"si":{"name":"q","prelink":"https://eu.startpage.com/sp/search?query=","postlink":"&t=blak&abp=-1&cat=pics&sc=Du1CQoBZh80g20"},"d":{"name":"DuckDuckGo","prelink":"https://duckduckgo.com/?q="},"di":{"name":"DuckDuckGo","prelink":"https://duckduckgo.com/?q=","postlink":" &iax=images&ia=images"},"r":{"name":"Reddit","base":"https://www.reddit.com/","prelink":"https://www.reddit.com/search?q="},"y":{"name":"Disphenoid","prelink":"http://localhost:4000/stream?q="},"ig":{"me":"instagram.com/plutonium.rar/","dm":"https://www.instagram.com/direct/inbox/"},"ap":{"name":"Amazon","prelink":"https://www.primevideo.com/search/ref=atv_nb_sr?phrase=","postlink":"&ie=UTF8"},"imdb":{"name":"IMDB","prelink":"https://www.imdb.com/find?q=","postlink":"&ref_=nv_sr_sm"},"dict":{"name":"Webster","prelink":"https://www.merriam-webster.com/dictionary/"},"wiki":{"name":"Wikipedia","prelink":"https://en.wikipedia.org/wiki/Special:Search?search="},"ht":{"name":"Web","prelink":"https://"},"htu":{"name":"Web","prelink":"http://"}}` )

const suggestions = ( SIn ) => {
    const sc_Old = document.getElementById( "suggestions" );
    if ( sc_Old ) sc_Old.remove();
    let sc = document.createElement( "script" );
    sc.src = `https://clients1.google.com/complete/search?client=youtube&hl=en&q=${ SIn }&jsonp=returnSug`;
    sc.id = "suggestions";
    document.body.appendChild( sc );
};

const setEngineImage = ( key ) => {
    const engineImage = find( '#engineImage' );
    if ( engineImage ) engineImage.src = `./icons/${ sites[ key ].name }.svg`
}

export const engine = ( input ) => {
    setEngineImage( 'root' );
    if ( input.charAt( 0 ) === '!' ) {
        const withBang = input.replace( '!', '' );
        let // blanks
            query,
            key;

        if ( sites.hasOwnProperty( withBang.split( ':' )[ 0 ] ) ) {
            key = withBang.split( ':' )[ 0 ];
            query = withBang.replace( key + ':', '' );
            setEngineImage( key );
            if ( query ) suggestions( query );
            return { key: key, query: query, url: sites[ key ][ query ] };
        }

        if ( sites.hasOwnProperty( withBang.split( ' ' )[ 0 ] ) ) {
            key = withBang.split( ' ' )[ 0 ];
            query = withBang.replace( key + ' ', '' );
            if ( query ) suggestions( query );
            setEngineImage( key );
            return { key: key, query: query, url: ( sites[ key ].prelink + encodeURIComponent( query ) + ( sites[ key ].postlink || '' ) ) };
        }
    }
    else suggestions( input );
    return { key: 's', query: input, url: ( sites[ 's' ].prelink + encodeURIComponent( input ) + ( sites[ 's' ].postlink || '' ) ) };
}

export const preprocessor = ( { key, query, url } ) => {
    const siteFunctions = {
        r: ( q ) => {
            if ( q.charAt( 0 ) === '/' ) return sites.r.base + 'r' + q;
            else return url;
            // },
            // y: ( q ) => {
            //     if ( q.charAt( 0 ) === '/' ) return sites.r.base + 'r' + q;
            //     else return url;
        }
    }
    if ( siteFunctions.hasOwnProperty( key ) ) return siteFunctions[ key ]( query );
    else return url;
}