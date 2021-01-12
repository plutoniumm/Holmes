<script>
    let space = [];
    fetch("https://www.spaceflightnewsapi.net/api/v2/articles")
        .then((res) => res.json())
        .then((r) => (space = r));
</script>

<style type="text/scss">
    .box {
        width: 100%;
        margin: 5px 0;
        background: #222;
        border-radius: 10px;
        img {
            object-fit: cover;
            width: 100%;
            border-radius: 5px;
        }
        p,
        div {
            padding: 2px 10px;
        }
    }
</style>

{#each space as el}
    <div class="box">
        <a href={el.url}>
            <img src={el.imageUrl} alt={el.title} />
            <div style="font-weight:400;">{el.title}</div>
            <p>{el.summary}</p>
            <div
                style="display: flex;color:#888;justify-content:space-between;">
                <span>{el.newsSite}</span>
                <span>{new Date(el.publishedAt).toLocaleDateString('en-GB', {
                        timeZone: 'UTC',
                        timeZoneName: 'short',
                    })}</span>
            </div>
        </a>
    </div>
{/each}
