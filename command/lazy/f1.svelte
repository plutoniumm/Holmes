<script>
    const f1News = async () => {
        const resp = await fetch("/social/f1/");
        return await resp.json();
    };
    let f1 = f1News();
</script>

{#await f1}
    <div class="w-100 blurW rpm-10" style="text-align:center;font-size:1.25em;">
        Getting News...
    </div>
{:then f1}
    <details class="blurW rpm-5 w-100" style="padding:15px;">
        <summary class="w-100" style="font-size:1.25em;font-weight:700;"
            >Top News</summary
        >
        <p>
            {#each f1 as news}
                {news.title};
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
