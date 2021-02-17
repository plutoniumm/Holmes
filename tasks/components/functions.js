export const timeCal = ( ti ) => {
    const splits = ti.split( ':' );
    const [ h, m, s ] = [ +( splits[ 0 ] ) * 3600, +( splits[ 1 ] ) * 60, +( splits[ 2 ] ) ];
    return h + m + s;
}

export const strCal = ( ti ) => {
    const time = ti;
    const [ h, m, s ] = [ ( ( ti / 3600 ) % 24 ), ( ( ti / 60 ) % 60 ), ( ti % 60 ) ];
    const full = `${ h < 10 ? '0' + ~~h : ~~h }:${ m < 10 ? '0' + ~~m : ~~m }:${ s < 10 ? '0' + ~~s : ~~s }`;

    return full;
}