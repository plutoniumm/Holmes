export const validity = ( func, args, expectedValue, returnParam ) => {
    const testValue = typeof args === 'array' ? func( ...args ) : func( args );
    if ( returnParam ) {
        if ( testValue[ returnParam ] === expectedValue ) return 0;
        else return testValue[ returnParam ];
    }
    if ( testValue === expectedValue ) return 0;
    else return testValue;
}