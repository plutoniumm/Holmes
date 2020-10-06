import sites from '../data/sites.json'

export const startsWith = ( str, word ) => {
      return str.lastIndexOf( word, 0 ) === 0;
}

export const preprocessor = ( key ) => {
      const sitFuncs = { "y": "window.location.href = send;" }
      const script = sitFuncs[ key ] || "window.location.href = send;";
      return script
}