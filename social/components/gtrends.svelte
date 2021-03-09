<script>
    let rss = [];

    fetch("/social/google/trends")
        .then((response) => response.json())
        .then((data) => (rss = data));
</script>

<section>
    {#each rss as n}
        <div class="news blur rpm-10">
            <div class="body-first">
                <span style="color:#f00">{n.title}</span>
                <i>{n.related.length ? `(${n.related.join(", ")})` : ""}</i>
            </div>
            <div class="container">
                {#each n.articles as nSub}
                    <div class="innerCont">
                        <a class="body flex" href={nSub.url}>
                            <img src={nSub.image} alt="" />
                            <div>
                                <div class="by">{nSub.source}</div>
                                <div class="title">{@html nSub.title}</div>
                                <div class="desc">{@html nSub.desc}</div>
                            </div>
                        </a>
                    </div>
                {/each}
            </div>
        </div>
    {/each}
</section>

<style type="text/scss">
    .news {
        overflow-x: scroll;
        img {
            border-radius: 2px;
            margin-right: 5px;
        }
        .container {
            overflow-x: scroll;
            display: flex;
            overflow: auto;
            .innerCont {
                .body {
                    width: 500px;
                    margin: 10px;
                    &-first {
                        width: 200px;
                    }
                }
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
