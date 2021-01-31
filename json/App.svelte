<script>
    let mlt = [],
        sng = [],
        tlk = [],
        display = "shows";

    fetch("/data/multiple.json")
        .then((res) => res.json())
        .then((r) => (mlt = r));
    fetch("/data/single.json")
        .then((res) => res.json())
        .then((r) => (sng = r));
    fetch("/data/talks.json")
        .then((res) => res.json())
        .then((r) => (tlk = r));

    import Multi from "./components/multiple.svelte";
    import Single from "./components/single.svelte";
    import Talks from "./components/talks.svelte";
</script>

<style type="text/scss">
    nav {
        display: flex;
        width: calc(100% - 10px);
        padding: 5px;
        background: #fff;
        color: #000;
        div {
            margin: 0 5px;
        }
    }
</style>

<section>
    <nav>
        <div on:click={() => (display = 'shows')}>Shows</div>
        <div on:click={() => (display = 'movies')}>Movies</div>
        <div on:click={() => (display = 'talks')}>Talks</div>
    </nav>
    {#if display == 'shows'}
        <Multi set={mlt} />
    {:else if display == 'movies'}
        <Single set={sng} />
    {:else if display == 'talks'}
        <Talks set={tlk} />
    {/if}
</section>
