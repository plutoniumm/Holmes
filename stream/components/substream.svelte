<script>
    export let vidoer, stacker, videos;
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
        <span style="width:100%;padding:0 5px;">Subscriptions ({videos.length})</span>
        {#each videos.sort((a, b) => new Date(b.snippet.publishedAt) - new Date(a.snippet.publishedAt)) as vid, i}
            <div class="recom" style="position:relative;">
                <div
                    on:click={stacker(vid)}
                    style="position:absolute;right:5px;top:5px;border-radius:7px;">
                    <svg
                        viewBox="0 0 32 32"
                        width="20"
                        height="20"
                        style="background:#000c;padding:5px;">
                        <path d="M16 2 L16 30 M2 16 L30 16" />
                    </svg>
                </div>
                <div
                    on:click={vidoer}
                    data-title={vid.snippet.title}
                    id={vid.snippet.resourceId.videoId}>
                    <img src={vid.snippet.thumbnails.medium.url} alt="" />
                    <div class="name">
                        {@html vid.snippet.title.slice(0, 60)}{vid.snippet.title.length > 60 ? '...' : ''}
                    </div>
                    <div
                        class="channel"
                        style="display:flex;justify-content:space-between;">
                        <span>{vid.snippet.channelTitle}</span>
                        <span>
                            {~~((new Date() - new Date(vid.snippet.publishedAt)) / (3600 * 1e3))}
                            hours ago
                        </span>
                    </div>
                </div>
            </div>
        {/each}
    {/if}
</section>
