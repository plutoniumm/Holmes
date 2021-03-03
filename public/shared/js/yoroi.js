export const repoSecurity = async () => {
    const req = await fetch( "/security/git" );
    const json = await req.json();
    return json;
}