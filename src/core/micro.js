export const sug = ( SIn ) => {
      const sc_Old = document.getElementById( "suggestions" );
      if ( sc_Old ) sc_Old.remove();
      var sc = document.createElement( "script" );
      sc.src = `https://clients1.google.com/complete/search?client=youtube&hl=en&q=${ SIn }&jsonp=returnSug`;
      sc.id = "suggestions";
      document.body.appendChild( sc );
};

export const startsWith = ( str, word ) => {
      return str.lastIndexOf( word, 0 ) === 0;
}

export const preprocessor = ( key ) => {
      const sitFuncs = { "y": "window.location.href = send;" }
      const script = sitFuncs[ key ] || "window.location.href = send;";
      return script
}