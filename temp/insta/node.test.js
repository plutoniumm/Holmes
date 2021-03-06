const fetch = require( 'node-fetch' );
const fs = require( 'fs' );

const base = 'https://www.instagram.com/'

const instaUser = async ( id ) => {
    const resp = await ( await fetch( base + id ) ).text();
    const mainJson = JSON.parse( resp.split( 'window._sharedData =' )[ 1 ].split( ';</script>' )[ 0 ] ).entry_data.ProfilePage[ 0 ].graphql.user;

    const children = ( arr ) => arr.map( e => {
        return {
            type: e.node.is_video ? 'Video' : 'Image',
            poster: e.node.display_url,
            post: ( e.node.is_video ? e.node.video_url : e.node.display_url ),
        }
    } )

    const reduced = {
        bio: mainJson.biography,
        name: mainJson.full_name,
        dp: mainJson.profile_pic_url,
        dpHD: mainJson.profile_pic_url_hd,
        uName: mainJson.username,
        posts: mainJson.edge_owner_to_timeline_media.edges.map( e => {
            let post = ( e.node.is_video ? e.node.video_url : e.node.display_url );
            return {
                type: ( e.is_video ? 'Video' : 'Image' ),
                poster: e.node.display_url,
                post: post || e.node.thumbnail_resources[ e.node.thumbnail_resources.length - 1 ],
                caption: e.node.edge_media_to_caption.edges[ 0 ].node.text || "No Caption",
                children: e.node.__typename == 'GraphSidecar' ? children( e.node.edge_sidecar_to_children.edges ) : null
            }
        } )
    }
    return reduced;
}

const users = [ 'jessicachastain/', 'neildegrassetyson/' ]
Promise.all( users.map( e => instaUser( e ) ) )
    .then( result => fs.writeFileSync( './insta.json', JSON.stringify( result ) ) );