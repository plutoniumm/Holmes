this.onmessage = e => {
      if ( e.data.func == "getTest" ) {
            fetch( "https://api.github.com/notifications?access_token=" ).then( res => res.json() ).then( r => {
                  this.postMessage( r )
            } )
      }
}