import sites from '../data/sites.json'


export const checkKey = ( key ) => {
      if ( typeof sites[ key ] == "undefined" ) return false;
      else return true;
}
export const startsWith = ( str, word ) => {
      return str.lastIndexOf( word, 0 ) === 0;
}