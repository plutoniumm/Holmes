<script>
    let // new line
        mlt = [],
        sng = [],
        trk = [],
        display = 1;

    $: search = "";

    fetch("/data/multiple.json")
        .then((res) => res.json())
        .then((r) => (mlt = r));
    fetch("/data/single.json")
        .then((res) => res.json())
        .then((r) => (sng = r));
    fetch("/data/track.json")
        .then((res) => res.json())
        .then((r) => (trk = r));

    import Multi from "./components/multiple.svelte";
    import Single from "./components/single.svelte";
    import Tracker from "./components/track.svelte";
    import Pending from "./components/pending.svelte";
</script>

<section>
    <nav class="blurW">
        {#each ["Movies", "Shows", "Tracker", "Pending"] as sh, i}
            <div
                class={display == i ? "blurW" : ""}
                on:click={() => (display = i)}
            >
                {sh}
            </div>
        {/each}
    </nav>
    {#if display == 0}
        <Single set={sng} state={search.toLowerCase()} />
    {:else if display == 1}
        <Multi set={mlt} state={search.toLowerCase()} />
    {:else if display == 2}
        <Tracker set={trk} state={search.toLowerCase()} />
    {:else}
        <Pending />
    {/if}
</section>
<section class="filter">
    <input
        type="text"
        class="engine blurW"
        placeholder="Search"
        bind:value={search}
    />
</section>

<svelte:head>
    <style>
        fieldset {
            border: 0;
            height: 2em;
            padding: 0;
        }
        .label {
            color: #888;
            font-size: 0.75em;
        }
        input {
            color: #fff;
            width: 100px;
        }
        .main img {
            width: 24px;
            height: 24px;
            border-radius: 5px;
            object-fit: contain;
            margin: 0 5px;
        }
        svg {
            background: #888;
            border-radius: 8px;
            margin: 3px 5px;
        }
    </style>
</svelte:head>

<style type="text/scss">
    section {
        padding: 60px 0;
    }
    nav {
        display: flex;
        justify-content: space-around;
        position: absolute;
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
    .filter {
        position: fixed;
        bottom: 0;
        width: 100%;
        transition: background 0.2s ease;
        .engine {
            width: 80%;
            font-size: 1.5em;
            margin: 0 5%;
            padding: 10px 5%;
            color: #fff;
            border-radius: 25px;
            transition: transform 0.2s ease;
            transform: translateY(50vh);
            &:focus {
                transform: translateY(0);
            }
        }
        &:hover {
            background: linear-gradient(to bottom, transparent, #3338);
            .engine {
                transform: translateY(0);
            }
        }
    }
</style>
