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
        border-radius: 10px;
        transition: all 0.2s ease;
        &:hover {
            background: #3338;
        }
    }
</style>

{#each tn as el}
    <div class="box blurW">
        <a href={el.data.url_overridden_by_dest}>
            <img
                src={el.data.thumbnail}
                alt={el.data.title}
                style="object-fit: cover;width:100%;border-radius:5px;" />
            <div style="font-weight:400;padding:5px;">{el.data.title}</div>
        </a>
    </div>
{/each}
