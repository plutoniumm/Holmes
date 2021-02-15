<script>
    let tn = [];
    fetch("https://www.reddit.com/r/technews/top/.json?count=20")
        .then((res) => res.json())
        .then((r) => (tn = [...r.data.children]));
</script>

{#each tn as el}
    <div class="boxy w-100 blurW">
        <a href={el.data.url_overridden_by_dest}>
            <img
                class="w-100"
                src={el.data.thumbnail}
                alt={el.data.title}
                style="object-fit: cover;border-radius:5px;"
            />
            <div style="font-weight:400;padding:5px;">{el.data.title}</div>
        </a>
    </div>
{/each}

<style type="text/scss">
    .boxy {
        margin: 5px 0;
        border-radius: 10px;
        transition: all 0.2s ease;
        &:hover {
            background: #3338;
        }
    }
</style>
