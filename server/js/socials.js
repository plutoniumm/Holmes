const parser = new ( require( 'rss-parser' ) )();


async function routes ( fastify, options ) {
    fastify.get( '/social/f1/', ( req, res ) => {
        parser.parseURL( 'https://www.autosport.com/rss/f1/news/' ).then( r => {
            r = r.items.map( e => {
                return {
                    title: e.title,
                    url: e.link,
                    date: e.pubDate,
                    image: e.enclosure.url,
                    desc: e.contentSnippet,
                }
            } );
            res.send( r );
        } );
    } );
}

module.exports = routes;