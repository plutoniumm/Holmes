<script>
    import { getReddit, date } from "../../public/shared/js/yoroi";

    let news = [];
    let subs = ["TechNews", "Science"];

    const getImg = (obj) => {
        const set = obj.resolutions;
        const res = set[set.length - 2];
        return res.url.replace(/&amp;/g, "&");
    };

    Promise.all(subs.map((e) => getReddit(e))).then((res) =>
        res.map((r) => {
            news = [...news, ...r];
        })
    );
</script>

<section class="flex" style="flex-wrap:wrap;">
    {#each news.sort((a, b) => {
        return new Date(a.data.created * 1e3) - new Date(b.data.created * 1e3);
    }) as el}
        <div
            class="boxy blurW"
            style="width:{el.data.title.length > 280
                ? '100%'
                : 'calc(50% - 10px)'}"
        >
            <a href={el.data.url_overridden_by_dest}>
                <img
                    class="w-100"
                    src={getImg(el.data.preview.images[0])}
                    alt={el.data.title}
                    onerror="this.src='https://i.redd.it/1if85xwae7qy.jpg';"
                />
                <div style="font-weight:400;padding:5px;">
                    {el.data.title}
                </div>
            </a>
        </div>
    {/each}
</section>

<style type="text/scss">
    .boxy {
        margin: 5px;
        border-radius: 3px;
        transition: all 0.2s ease;
        &:hover {
            background: #3338;
        }
        img {
            border-radius: 5px;
            object-fit: cover;
            height: 200px;
        }
    }
</style>
