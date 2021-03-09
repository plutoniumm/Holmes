<script>
    import {
        getReddit,
        redditImage,
        fallback,
    } from "../../public/shared/js/yoroi";

    let subs = ["worldnews", "todayilearned"];
    let news = [];

    Promise.all(subs.map((e) => getReddit(e))).then((res) =>
        res.map((r) => (news = [...news, ...r]))
    );
</script>

{#each news.sort((a, b) => {
    return new Date(a.data.created * 1e3) - new Date(b.data.created * 1e3);
}) as el}
    <div
        class="boxy2 blurW"
        style="width:{el.data.title.length > 280 ? '100%' : 'calc(50% - 10px)'}"
    >
        <a href={el.data.url_overridden_by_dest}>
            <img
                class="w-100"
                src={redditImage(el.data?.preview?.images[0]) || fallback}
                alt={el.data.title}
            />
            <div style="font-weight:400;padding:5px;">
                {el.data.title}
            </div>
        </a>
    </div>
{/each}

<style type="text/scss">
    .boxy2 {
        margin: 5px;
        border-radius: 3px;
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
