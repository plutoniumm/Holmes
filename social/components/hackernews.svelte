<script>
    let news = [];
    if (window.Worker) {
        let w = new Worker("./helpers/thread.js");
        var msg = { func: "getHNTop" };
        w.postMessage(msg);
        w.onmessage = (e) => (news = e.data.HN);
    }

    const urlP = (url) => {
        let t2 = "";
        if (url) {
            const type = new URL(url);
            t2 = type.hostname;
            if (t2.includes("www")) t2 = t2.replace("www.", "");
            return `(${t2})`;
        }
        return t2;
    };
</script>

<section>
    {#each news as n}
        <div class="rpm-10 blur">
            <a href={n.url} class="news">
                <div class="title">
                    {n.title} - <i>{n.by}</i>
                    <span class="desc">{urlP(n.url)}</span>
                </div>
                <div class="desc" style="font-size: 0.8em;">
                    {n.score} points| {n.descendants} comments | {new Date(
                        n.time
                    ).toLocaleString("en-GB")}
                </div>
            </a>
        </div>
    {/each}
</section>

<style>
    .desc {
        color: #888;
    }
</style>
