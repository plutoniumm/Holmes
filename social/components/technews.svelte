<script>
    let newzes = [
        { name: "TechNews", news: [] },
        { name: "WallStreetBets", news: [] },
        { name: "Science", news: [] },
        { name: "TodayILearned", news: [] },
    ];

    const [cfg, r] = ["/top/.json?limit=5", "https://www.reddit.com/r/"];

    Promise.all(newzes.map((e) => fetch(r + e.name + cfg)))
        .then((resp) => Promise.all(resp.map((r) => r.json())))
        .then((result) =>
            result.map((r, i) => (newzes[i].news = r.data.children))
        );
</script>

<section class="flex">
    {#each newzes as topic}
        <article class="w-25 rpm-5">
            <div class="blur rpm-5">{topic.name}</div>
            {#each topic.news as el}
                <div class="boxy blur">
                    <a href={el.data.url_overridden_by_dest}>
                        <img
                            class="w-100"
                            src={el.data.thumbnail}
                            alt={el.data.title}
                            onerror="this.onerror=null;this.src='https://i.redd.it/1if85xwae7qy.jpg';"
                            style="object-fit: cover;border-radius:5px;"
                        />
                        <div style="font-weight:400;padding:5px;">
                            {el.data.title.replace(/TIL/g, "")}
                        </div>
                    </a>
                </div>
            {/each}
        </article>
    {/each}
</section>

<style type="text/scss">
    .boxy {
        margin: 5px 0;
        border-radius: 10px;
        transition: all 0.2s ease;
        &:hover {
            background: #3338;
        }
        img {
            object-fit: cover;
            width: 100%;
            height: 200px;
        }
    }
</style>
