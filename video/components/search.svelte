<script>
    export let videos = [];

    import { vidoer, stacker } from "../core/store";
</script>

<section id="search">
    {#if videos.length > 0}
        <div
            style="width:99vw;padding:0 5px;display:flex;justify-content:space-between;"
        >
            <div>Search</div>
            <div on:click={() => (videos = [])}>X</div>
        </div>
        {#each videos as vid}
            <div class="recom" style="position:relative;">
                <div
                    on:click={stacker(vid)}
                    style="position:absolute;right:5px;top:5px;border-radius:7px;"
                >
                    <svg
                        viewBox="0 0 32 32"
                        width="20"
                        height="20"
                        style="background:#000c;padding:5px;"
                    >
                        <path d="M16 2 L16 30 M2 16 L30 16" />
                    </svg>
                </div>
                <a
                    href="#wrapper"
                    on:click={vidoer}
                    data-title={vid.snippet.title}
                    id={vid.id.videoId}
                >
                    <img src={vid.snippet.thumbnails.medium.url} alt="" />
                    <div class="name">
                        {@html vid.snippet.title.slice(0, 60)}{vid.snippet.title
                            .length > 60
                            ? "..."
                            : ""}
                    </div>
                    <div
                        class="channel"
                        style="display:flex;justify-content:space-between;"
                    >
                        <div>{vid.snippet.channelTitle}</div>
                        <div>
                            {new Intl.DateTimeFormat("en-GB").format(
                                new Date(vid.snippet.publishedAt)
                            )}
                        </div>
                    </div>
                </a>
            </div>
        {/each}
    {/if}
</section>

<style type="text/scss">
    section {
        padding: 20px 10px;
        display: flex;
        flex-wrap: wrap;
    }
</style>
