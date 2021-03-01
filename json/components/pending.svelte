<script>
    $: shows = [];
    if (window.Worker) {
        let w = new Worker("./helpers/thread.js");
        var msg = { func: "getShows" };
        w.postMessage(msg);
        w.onmessage = (e) => {
            shows = [...shows, e.data.show];
            close();
        };
    }
</script>

{#each shows as show}
    <div class="show rpm-10 flex blurW">
        <img src={show.image} alt="" />
        <div style="padding: 2px 5px;">
            <div>{show.latest}</div>
            <p style="font-weight:600;">
                {show.name}:
                <i>{show.ep}</i>
            </p>
            {@html show.abt}
        </div>
    </div>
{/each}

<style type="text/scss">
    .show {
        img {
            border-radius: 5px;
            width: 400px;
            height: 250px;
            object-fit: cover;
        }
    }
</style>
