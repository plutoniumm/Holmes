// const fetch = require( 'node-fetch' );
const googleTrends = require( 'google-trends-api' );

const smartFilter = ( item ) => {
    const filertlist = [
        // SPORTS
        "nba", "baseball", "football",
        "basketball", "nfl", "wrestling",
        "cricket", "wwe", "league",

        // TECH
        "oppo", "oneplus", "motorola",

        // LANGUAGE
        "panchang", "हिंदी",

        // ENTERTAINMENT
        "bts"
    ];
    const heads = [ "title", "source", "desc", "url" ];
    for ( const hd of heads )
        if ( filertlist.some( ( v ) => item[ hd ]?.toLowerCase().indexOf( v ) >= 0 ) )
            return 0;
    for ( const it of item.articles )
        for ( const hd of heads )
            if ( filertlist.some( ( v ) => it[ hd ]?.toLowerCase().indexOf( v ) >= 0 ) )
                return 0;
    return 1;
};

async function routes ( fastify, options ) {
    fastify.get( '/social/google/trends', ( req, res ) => {
        const locations = [ 'US', 'GB', 'IN' ];
        Promise.all( locations.map( e => googleTrends.dailyTrends( { geo: e } ) ) )
            .then( result => {
                let newsItems = [];
                const json = result.map( e => JSON.parse( e ).default.trendingSearchesDays );
                json.forEach( ctr => ctr.forEach( item => newsItems.push( ...item.trendingSearches ) ) );
                newsItems = newsItems.map( e => {
                    return {
                        title: e.title.query,
                        related: e.relatedQueries?.map( e => e.query ),
                        traffic: +( e.formattedTraffic?.replace( 'K+' ) ),
                        articles: e.articles.map( e2 => {
                            return {
                                title: e2.title,
                                url: e2.url,
                                source: e2.source,
                                desc: e2.snippet,
                                image: e2.image?.imageUrl
                            }
                        } ).slice( 0, 5 )
                    }
                } );
                res.send( newsItems.filter( smartFilter ) );
            } )
            .catch( err => console.log( err ) );
    } );
    fastify.get( '/social/google/mini-trends', ( req, res ) => {
        const locations = [ 'US', 'GB', 'IN' ];
        Promise.all( locations.map( e => googleTrends.dailyTrends( { geo: e } ) ) )
            .then( result => {
                let newsItems = [];
                const json = result.map( e => JSON.parse( e ).default.trendingSearchesDays );
                json.forEach( ctr => ctr.forEach( item => newsItems.push( ...item.trendingSearches ) ) );
                newsItems = newsItems.map( e => {
                    return {
                        title: e.title.query,
                        traffic: +( e.formattedTraffic.replace( 'K+', '' ).replace( 'M+', '000' ) ),
                        articles: e.articles.map( e2 => {
                            return {
                                title: e2.title,
                                url: e2.url,
                                source: e2.source,
                                desc: e2.snippet,
                                image: e2.image?.imageUrl
                            }
                        } ).slice( 0, 1 )
                    }
                } )
                    .filter( smartFilter )
                    .sort( ( a, b ) => b.traffic - a.traffic )
                    .slice( 0, 6 );
                res.send( newsItems );
            } )
            .catch( err => console.log( err ) );
    } );
}
module.exports = routes;