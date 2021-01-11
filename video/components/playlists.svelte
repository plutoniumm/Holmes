<script>
    import { playlist } from "../core/api.js";
    export let videos, fullStacker;

    const usePL = (e) => {
        playlist(e.target.parentElement.id).then((r) =>
            fullStacker(
                r.items
                    .sort(
                        (a, b) =>
                            new Date(b.snippet.publishedAt) -
                            new Date(a.snippet.publishedAt)
                    )
                    .reverse()
            )
        );
    };
</script>

<style type="text/scss">
    section {
        padding: 20px 10px;
        display: flex;
        flex-wrap: wrap;
    }
</style>

<section id="search">
    {#if videos.length > 0}
        <span style="width:100%;padding:0 5px;">Playlists</span>
        {#each videos as vid}
            <div on:click={usePL} class="recom" id={vid.id.playlistId}>
                <img src={vid.snippet.thumbnails.medium.url} alt="" />
                <div class="name">
                    {@html vid.snippet.title.slice(0, 60)}{vid.snippet.title.length > 60 ? '...' : ''}
                </div>
                <div
                    class="channel"
                    style="display:flex;justify-content:space-between;">
                    <span>{vid.snippet.channelTitle}</span>
                    <span>
                        {new Intl.DateTimeFormat('en-GB').format(new Date(vid.snippet.publishedAt))}
                    </span>
                </div>
            </div>
        {/each}
    {/if}
</section>
