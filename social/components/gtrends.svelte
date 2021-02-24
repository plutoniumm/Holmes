<script>
    let rss = [];
    fetch("/social/google/trends")
        .then((response) => response.text())
        .then((str) => new window.DOMParser().parseFromString(str, "text/xml"))
        .then((data) => {
            rss = [...data.querySelectorAll("item")].map((e) => {
                const newsItems = [...e.getElementsByTagName("ht:news_item")];
                return {
                    title: e.querySelector("title").textContent,
                    desc: e.querySelector("description").textContent,
                    img: e.getElementsByTagName("ht:picture")[0].textContent,
                    items: newsItems.map((e2) => {
                        return {
                            title: e2.getElementsByTagName(
                                "ht:news_item_title"
                            )[0].textContent,
                            desc: e2.getElementsByTagName(
                                "ht:news_item_snippet"
                            )[0].textContent,
                            url: e2.getElementsByTagName("ht:news_item_url")[0]
                                .textContent,
                            src: e2.getElementsByTagName(
                                "ht:news_item_source"
                            )[0].textContent,
                        };
                    }),
                };
            });
        });
</script>

<section>
    {#each rss as n}
        <div class="news flex blur rpm-10">
            <div class="body-first">
                <div class="trend">
                    {n.title}
                </div>
                <div class="desc">
                    {n.desc}
                </div>
                <img src={n.img} alt="" />
            </div>
            {#each n.items as nSub}
                <div class="body">
                    <a href={nSub.url}>
                        <div class="by">{nSub.src}</div>
                        <div class="title">{@html nSub.title}</div>
                        <div class="desc">{@html nSub.desc}</div>
                    </a>
                </div>
            {/each}
        </div>
    {/each}
</section>

<style type="text/scss">
    .news {
        overflow-x: scroll;
        img {
            border-radius: 2px;
        }
        .trend {
            color: #f00;
        }
        .body {
            width: 500px;
            margin: 0 10px;
            &-first {
                width: 200px;
            }
        }
        .by {
            font-style: italic;
        }
        .title {
            font-weight: 600;
        }
    }
</style>
