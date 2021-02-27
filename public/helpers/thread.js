let shows = [], stack = [];
const ms = ( milli ) => {
      let time = '<1 Day';
      const m = Math.floor( +milli / ( 60 * 1000 ) );
      const h = Math.floor( m / 60 ) % 24;
      const d = Math.floor( h / 24 ) % 365;
      if ( h > 0 ) time = `${ h } h`;
      if ( d > 0 ) time += ` ${ d } d`;
      return time
}

const HNBase = 'https://hacker-news.firebaseio.com/v0/';
const HNCfg = '?print=pretty'
this.onmessage = e => {
      if ( e.data.func == "getShows" ) {
            fetch( "/data/multiple.json" )
                  .then( ( res ) => res.json() )
                  .then( ( r ) => {
                        r.forEach( el => {
                              let temp = new Date( el.day )
                              if ( ( el.state !== "Completed" && el.state !== "Ended" && el.state !== "Cancelled" ) )
                                    fetch( 'http://api.tvmaze.com/singlesearch/shows?q=' + el.record )
                                          .then( res => res.json() ).then( r =>
                                                fetch( r[ "_links" ].previousepisode.href ).then( res => res.json() )
                                                      .then( r => {
                                                            if ( ( new Date( r.airstamp ) - temp ) / 864e5 > 1 )
                                                                  this.postMessage( {
                                                                        "show": {
                                                                              "name": el.record,
                                                                              "latest": new Date( r.airstamp ).toLocaleDateString(),
                                                                              "ep": r.name,
                                                                              "abt": r.summary,
                                                                              "image": r.image.original
                                                                        }
                                                                  } );
                                                      } )
                                          )
                        } );
                  } );
      }
      if ( e.data.func == 'getHNTop' ) {
            let news = [];
            fetch( HNBase + 'topstories.json' + HNCfg )
                  .then( res => res.json() )
                  .then( r => {
                        Promise.all( r.slice( 0, 40 ).map( e => fetch( HNBase + 'item/' + e + '.json' + HNCfg ) ) )
                              .then( resp => Promise.all( resp.map( r => r.json() ) ) )
                              .then( result => {
                                    result.map( e => {
                                          return {
                                                title: e.title,
                                                by: e.by,
                                                descendants: e.descendants,
                                                score: e.score,
                                                url: e.url,
                                                time: e.time
                                          }
                                    } );
                                    this.postMessage( { "HN": result } )
                              } )
                  } )
      }
}