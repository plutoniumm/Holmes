<script>
    let tn = [];
    fetch("https://www.reddit.com/r/technews/top/.json?count=20")
        .then((res) => res.json())
        .then((r) => (tn = [...r.data.children]));
</script>

<style type="text/scss">
    .box {
        width: 100%;
        margin: 5px 0;
        background: #222;
        border-radius: 10px;
        transition: all 0.2s ease;
        &:hover {
            background: #333;
            transform: translateX(5px);
        }
    }
</style>

{#each tn as el}
    <div class="box">
        <a href={el.data.url_overridden_by_dest}>
            <img
                src={el.data.thumbnail}
                alt={el.data.title}
                style="object-fit: cover;width:100%;border-radius:5px;" />
            <div style="font-weight:400;padding:5px;">{el.data.title}</div>
            <!-- <div
                style="display: flex;color:#888;justify-content:space-between;">
                <span>{el.data.subreddit_name_prefixed}</span>
                <span>{new Date(el.data.created * 1000).toLocaleDateString(
                        'en-GB',
                        { timeZone: 'UTC', timeZoneName: 'short' }
                    )}</span>
            </div> -->
        </a>
    </div>
    <!-- <hr /> -->
{/each}
