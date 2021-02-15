<script>
    let space = [];
    fetch("https://www.spaceflightnewsapi.net/api/v2/articles")
        .then((res) => res.json())
        .then((r) => (space = r));
</script>

{#each space as el}
    <div class="boxy w-100 blur">
        <a href={el.url}>
            <img class="w-100" src={el.imageUrl} alt={el.title} />
            <div style="font-weight:400;">{el.title}</div>
            <p>{el.summary}</p>
            <div
                style="display: flex;color:#888;justify-content:space-between;"
            >
                <span>{el.newsSite}</span>
                <span
                    >{new Date(el.publishedAt).toLocaleDateString("en-GB", {
                        timeZone: "UTC",
                        timeZoneName: "short",
                    })}</span
                >
            </div>
        </a>
    </div>
{/each}

<style type="text/scss">
    .boxy {
        margin: 5px 0;
        border-radius: 10px;
        img {
            object-fit: cover;
            border-radius: 5px;
        }
        p,
        div {
            padding: 2px 10px;
        }
        &:hover {
            background: #3338;
        }
    }
</style>
