<script>
    let mlt = [],
        sng = [],
        display = 1;

    fetch("/data/multiple.json")
        .then((res) => res.json())
        .then((r) => (mlt = r));
    fetch("/data/single.json")
        .then((res) => res.json())
        .then((r) => (sng = r));

    import Multi from "./components/multiple.svelte";
    import Single from "./components/single.svelte";
</script>

<section>
    <nav class="blurW">
        <div class={display ? "blurW" : ""} on:click={() => (display = 1)}>
            Movies
        </div>
        <div class={!display ? "blurW" : ""} on:click={() => (display = 0)}>
            Shows
        </div>
    </nav>
    {#if display}
        <Single set={sng} />
    {:else}
        <Multi set={mlt} />
    {/if}
</section>

<style type="text/scss">
    section {
        padding: 60px 0;
    }
    nav {
        display: flex;
        justify-content: space-around;
        position: fixed;
        top: 0;
        z-index: 999;
        border-radius: 10px;
        margin: 10px;
        padding: 10px;
        width: calc(100% - 40px);
        color: #fff;
        div {
            cursor: pointer;
            padding: 5px 5%;
            border-radius: 5px;
            margin: 0 5px;
            transition: transform 0.2s ease;
            &:hover {
                transform: scale(1.05);
            }
        }
    }
</style>
