<script>
    const googleTrends = async () => {
        const resp = await fetch("/social/google/mini-trends");
        return await resp.json();
    };
    let google = googleTrends();
</script>

{#await google}
    <div class="w-100 blurW rpm-10" style="text-align:center;font-size:1.25em;">
        Getting News...
    </div>
{:then google}
    <details class="blurW rpm-5 w-100" style="padding:15px;">
        <summary class="w-100" style="font-size:1.25em;font-weight:700;"
            >Top News</summary
        >
        <p>
            {#each google as news}
                {#each news.articles as article}
                    <a class="boxy flex" href={article.url}>
                        <div style="padding:20px 50x;">
                            <div style="font-weight:400;font-size:0.75em;">
                                {article.source}
                            </div>
                            <div style="font-weight:500">
                                {@html article.title}
                            </div>
                            <div
                                style="font-weight:400;color:#888;font-size:0.75em;"
                            >
                                {news.title}
                            </div>
                        </div>
                        <img
                            src={article.image}
                            height="100px"
                            width="100px"
                            style="margin-left:100px;"
                            alt=""
                        />
                    </a>
                {/each}
            {/each}
        </p>
    </details>
{/await}

<style type="text/scss">
    .boxy {
        margin: 5px;
        justify-content: space-between;
        padding: 10px 5px;
        &:hover {
            background: #3338;
        }
        img {
            border-radius: 5px;
            object-fit: cover;
        }
    }
    summary,
    summary:focus {
        outline: none;
    }
</style>
