const fetch = require( 'node-fetch' );
const fs = require( 'fs' );

const base = 'https://www.instagram.com/'

fetch( base + 'jessicachastain/' )
    .then( res => res.text() )
    .then( r => {
        const mainJson = JSON.parse( r.split( 'window._sharedData =' )[ 1 ].split( ';</script>' )[ 0 ] ).entry_data.ProfilePage[ 0 ].graphql.user;
        const reduced = {
            bio: mainJson.biography,
            name: mainJson.full_name,
            dp: mainJson.profile_pic_url,
            dpHD: mainJson.profile_pic_url_hd,
            uName: mainJson.username,
            posts: mainJson.edge_owner_to_timeline_media.edges.map( e => {
                let post = '';
                console.log( e.is_video );
                if ( e.is_video ) post = e.node.video_url
                else post = e.node.display_url
                return {
                    type: ( e.is_video ? 'Video' : 'Image' ),
                    thumb: e.node.thumbnail_resources[ 0 ].src || "ERROR!!!",
                    post: post || e.node.thumbnail_resources[ e.node.thumbnail_resources.length - 1 ],
                    caption: e.node.edge_media_to_caption.edges[ 0 ].node.text || "ERROR!!!"
                }
            } )
        }
        fs.writeFileSync( './insta.json', JSON.stringify( reduced ) );
    } );