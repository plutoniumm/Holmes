function ab2str8 ( b ) { return String.fromCharCode.apply( null, new Uint8Array( b ) ); }
function str2ab8 ( s ) { var b = new ArrayBuffer( s.length ); var bV = new Uint8Array( b ); for ( var i = 0;i < s.length;i++ ) { bV[ i ] = s.charCodeAt( i ); } return b; }
function concatenate ( ...arrays ) { let size = arrays.reduce( ( a, b ) => a + b.byteLength, 0 ); let result = new Uint8Array( size ); let offset = 0; for ( let arr of arrays ) { result.set( arr, offset ); offset += arr.byteLength } return result }

const pwd = "Chernobyl";

async function getKey ( salt, pwd ) {
      const textEncoder = new TextEncoder( "utf-8" );
      const pwdBuffer = textEncoder.encode( pwd );
      const importedKey = await crypto.subtle.importKey( "raw", pwdBuffer, "PBKDF2", false, [ "deriveBits" ] );
      const params = { name: "PBKDF2", hash: 'SHA-512', salt: salt, iterations: 250000 };
      const derivation = await crypto.subtle.deriveBits( params, importedKey, 64 * 8 );
      const keylen = 32;
      const derivedKey = derivation.slice( 0, keylen );
      const iv = derivation.slice( keylen );
      const importedEncryptionKey = await crypto.subtle.importKey( 'raw', derivedKey, { name: 'AES-GCM' }, false, [ 'encrypt', 'decrypt' ] );
      return { key: importedEncryptionKey, iv: iv }
}

async function encrypt ( text, pwd ) {
      const salt = window.crypto.getRandomValues( new Uint8Array( 32 ) );
      const keyObject = await getKey( salt, pwd )
      const textEncoder = new TextEncoder( "utf-8" );
      const textBuffer = textEncoder.encode( text );
      const enccTxt = await crypto.subtle.encrypt( { name: 'AES-GCM', iv: keyObject.iv }, keyObject.key, textBuffer );
      enccPkg = btoa( ab2str8( salt ) ) + btoa( ab2str8( enccTxt ) );
      return enccPkg;
}
async function decrypt ( enccPkg, pwd ) {
      const enccTxt = enccPkg.slice( 44 );
      const salt = str2ab8( atob( enccPkg.slice( 0, 44 ) ) );
      const keyObject = await getKey( salt, pwd )
      const textDecoder = new TextDecoder( "utf-8" );
      const decryptedText = await crypto.subtle.decrypt( { name: 'AES-GCM', iv: keyObject.iv }, keyObject.key, str2ab8( atob( enccTxt ) ) );
      return textDecoder.decode( decryptedText );
}

( async () => {
      const encc = await encrypt( 'This is the password', pwd )
      console.log( encc );
      const decc = await decrypt( encc, pwd )
      console.log( decc );

} )()