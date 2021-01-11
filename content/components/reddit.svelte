<script>
    let tn = [];
    fetch("https://www.reddit.com/r/technews/top/.json?count=20")
        .then((res) => res.json())
        .then((r) => (tn = [...r.data.children]));
</script>

{#each tn as el}
    <div style="width:100%;margin:5px 0;">
        <a href={el.data.url_overridden_by_dest}>
            <img
                src={el.data.thumbnail}
                alt={el.data.title}
                style="object-fit: cover;width:100%;border-radius:5px;" />
            <div style="font-weight:400;padding:2px 0">{el.data.title}</div>
            <div
                style="display: flex;color:#888;justify-content:space-between;">
                <span>{el.data.subreddit_name_prefixed}</span>
                <span>{new Date(el.data.created * 1000).toLocaleDateString(
                        'en-GB',
                        { timeZone: 'UTC', timeZoneName: 'short' }
                    )}</span>
            </div>
        </a>
    </div>
    <hr />
{/each}
