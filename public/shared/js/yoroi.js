export const repoSecurity = async () => {
    const req = await fetch( "/security/git" );
    const json = await req.json();
    return json;
}

export const getReddit = async ( sub ) => {
    const raw = await fetch( "https://www.reddit.com/r/" + sub + "/top/.json?limit=5" );
    const json = await raw.json();
    return json.data.children;
}

export const date = ( date = new Date() ) => {
    return new Date( date ).toLocaleDateString( "en-GB", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
    } );
}