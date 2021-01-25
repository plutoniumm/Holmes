const { exec } = require( "child_process" );

let reminders = [];
exec( `osascript -e ' tell application "Reminders"
            set mylist to id of list "Stack"
            set reminderList to[]
            set reminderList to name of reminders whose id of container is mylist
            quit
            return reminderList
            end tell'`, ( err, sto, sterr ) => {
    if ( err ) return console.log( err );
    if ( sterr ) return console.log( sterr )
    reminders = [ ...sto.split( ', ' ).map( e => { return { "list": e.trim(), "notes": [] } } ) ];
} );

exec( `osascript -e ' tell application "Reminders"
            set mylist to id of list "Stack"
            set reminderList to[]
            set reminderList to body of reminders whose id of container is mylist
            quit
            return reminderList
            end tell'`, ( err, sto, sterr ) => {
    if ( err ) return console.log( err );
    if ( sterr ) return console.log( sterr );
    let stoes = sto.split( ', ' )
    reminders.forEach( ( e, i ) => ( e.notes = [ ...( stoes[ i ].split( '\n' ) ) ] ) )
} );