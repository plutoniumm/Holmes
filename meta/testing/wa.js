const pr = require( 'playwright' );

( async () => {
    const browser = pr[ 'webkit' ].launch( { headless: false } );
    const ctx = ( await browser ).newContext();
    const pg = ( await ctx ).newPage();

    const groups = [ "SEDS Celestia 2021", "Chemical Engineering '23", "CTE: Instructors 2021sem2", "Chemical dualites", "Cosmology", "Mathletes '18", "SEDS Celestia CTE|11:30am" ];

    ( await pg ).goto( "https://web.whatsapp.com" );
    ( await pg ).waitForSelector( "span[title='MX']" );


    ( await pg ).click( `span[title="${ groups[ 6 ] }"]` );
    ( await pg ).waitForTimeout( .5 * 1e3 );
    ( await pg ).click( "#main span[data-icon='menu']" );
    ( await pg ).waitForTimeout( 1.5 * 1e3 );
    ( await pg ).click( "div[title='Clear messages']" );
    ( await pg ).waitForTimeout( 1.5 * 1e3 );
    ( await pg ).click( "div[data-animate-modal-popup] div[role='button']:last-child" );
} )()