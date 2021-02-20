export const timeCal = ( ti ) => {
    const splits = ti.split( ':' );
    const [ h, m, s ] = [ +( splits[ 0 ] ) * 3600, +( splits[ 1 ] ) * 60, +( splits[ 2 ] ) ];
    return h + m + s;
}

export const strCal = ( ti ) => {
    const ti2 = ti;
    const [ h, m, s ] = [ ( ( ti2 / 3600 ) % 24 ), ( ( ti2 / 60 ) % 60 ), ( ti2 % 60 ) ];
    const full = `${ h < 10 ? '0' + ~~h : ~~h }:${ m < 10 ? '0' + ~~m : ~~m }:${ s < 10 ? '0' + ~~s : ~~s }`;
    return full;
}

const URL = "/assets/doof.m4a";
const AudioContext = window.AudioContext || window.webkitAudioContext;
const ctx = new AudioContext(); // Make it crossbrowser
ctx.createGain().gain.value = 1;
let yodelBuffer = void 0;

fetch( URL )
    .then( ( r ) => r.arrayBuffer() )
    .then( ( arrBuff ) =>
        ctx.decodeAudioData(
            arrBuff,
            ( aud ) => ( yodelBuffer = aud ),
            ( e ) => console.error( e )
        )
    );

export const play = () => {
    let source = ctx.createBufferSource();
    source.buffer = yodelBuffer;
    source.connect( ctx.destination );
    source.start();
};