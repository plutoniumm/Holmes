<script>
    $: shows = [];
    if (window.Worker) {
        let w = new Worker("./ext.js");
        var msg = { func: "getShows" };
        w.postMessage(msg);
        w.onmessage = (e) => {
            shows = [...shows, e.data.show];
        };
    }
</script>

<style type="text/scss">
    .show {
        img {
            width: 100%;
            border-radius: 5px;
            max-height: 200px;
            object-fit: cover;
        }
    }
</style>

<div>
    {#each shows as show}
        <div class="show">
            <img src={show.image} alt="" />
            <div style="display:flex;justify-content:space-between;">
                <div>{show.latest}</div>
                <div>{show.name}</div>
            </div>
            <p style="font-weight:600;">{show.ep}</p>
            {@html show.abt}
        </div>
        <hr />
    {/each}
</div>
