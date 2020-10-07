import sites from '../data/sites.json'

export const startsWith = ( str, word ) => {
      return str.lastIndexOf( word, 0 ) === 0;
}

export const preprocessor = ( key ) => {
      const sitFuncs = { "y": "window.location.href = send;" }
      const script = sitFuncs[ key ] || "window.location.href = send;";
      return script
}

export const ms = ( milli ) => {
      let time = '<1 Day';
      const m = Math.round( milli / ( 60 * 1000 ) ) % 60
      const h = Math.round( m / 60 ) % 24
      const d = Math.round( h / 24 ) % 365
      if ( h > 0 ) time = `${ h } h`
      if ( d > 0 ) time += `${ d } d`
      return time
}