const ms = ( milli ) => {
      let time = '<1 Day';
      const m = Math.floor( +milli / ( 60 * 1000 ) );
      const h = Math.floor( m / 60 ) % 24;
      const d = Math.floor( h / 24 ) % 365;
      if ( h > 0 ) time = `${ h } h`;
      if ( d > 0 ) time += ` ${ d } d`;
      return time
}

this.onmessage = e => {
      if ( e.data.func == "getTest" ) {
            fetch( "https://api.github.com/notifications?access_token=YOUR_TOKEN" ).then( res => res.json() ).then( r => {
                  const n = r.map( el => { return { "updated_at": ms( new Date() - new Date( el.updated_at ) ), "title": el.subject.title, "type": el.subject.type, "owner": el.repository.owner.html_url, "repo": el.repository.name } } );
                  this.postMessage( n );
            } )
      }
}