<script>
    let space = [];
    fetch("https://www.spaceflightnewsapi.net/api/v2/articles")
        .then((res) => res.json())
        .then((r) => (space = r));
</script>

{#each space as el}
    <div style="width:100%;margin:5px 0;">
        <a href={el.url}>
            <img
                src={el.imageUrl}
                alt={el.title}
                style="object-fit: cover;width:100%;border-radius:5px;" />
            <div style="font-weight:400;padding:2px 0">{el.title}</div>
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
    <hr />
{/each}
