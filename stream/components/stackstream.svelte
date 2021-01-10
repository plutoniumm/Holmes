<script>
    export let videos, vidoer, destacker;
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
        <span style="width:100%;padding:0 5px;">Queue</span>
        {#each videos as vid, i}
            <div class="recom" style="position:relative;">
                <div
                    on:click={destacker(i)}
                    style="position:absolute;right:5px;top:5px;border-radius:7px;">
                    <svg
                        viewBox="0 0 32 32"
                        width="20"
                        height="20"
                        style="background:#000c;padding:5px;">
                        <path d="M2 30 L30 2 M30 30 L2 2" />
                    </svg>
                </div>
                <div
                    on:click={vidoer}
                    data-title={vid.snippet.title}
                    id={vid.id.videoId || vid.snippet.resourceId.videoId}>
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
            </div>
        {/each}
    {/if}
</section>
