<script>
    export let searcher, states, channels;

    import { URLpars } from "../core/api";
    let bar;
</script>

<style type="text/scss">
    section {
        width: calc(100% - 10px);
        display: flex;
        position: fixed;
        top: 0;
        justify-content: space-between;
        background: #222;
        transition: all 0.3s ease;
        align-items: center;
        padding: 10px 5px;
        input {
            padding: 5px 10px;
            background: #444;
            font-size: 1.1em;
            color: #fff;
            border: 0;
            border-radius: 2px;
            margin: 0;
            outline: none;
            &::placeholder {
                color: #aaaa;
            }
        }
    }
    .plist {
        border: 1px solid transparent;
        background: #fff;
        color: #000;
        border-radius: 5px;
        margin: 0 2px;
        padding: 10px;
        transition: all 0.2s ease;
        &:hover {
            border: 1px solid #444;
            box-shadow: 0 0 1px 1px #fff;
        }
    }
    .active {
        background: #f00;
        color: #fff;
    }
</style>

<section
    bind:this={bar}
    style="z-index:9;opacity:{URLpars().id ? 0 : 1}"
    on:mouseenter={() => (bar.style.opacity = 1)}
    on:mouseleave={() => (bar.style.opacity = 0)}>
    <a href="/#" style="font-size:1.5em;position:relative;top:-0.2em;">
        <img
            src="./icons/disphenoid.svg"
            alt=""
            style="width:1.5em;position:relative;top:0.37em;left:0.2em;transform:scale(1.2);" />
        Diasphenoid
    </a>

    <form on:submit|preventDefault={searcher()}>
        <input
            id="srcBox"
            size="40"
            placeholder="Search"
            value={URLpars().q || ''} />
        <svg
            viewBox="0 0 32 32"
            width="20"
            height="20"
            style="position:relative;left:-32px;top:4px;">
            <circle cx="14" cy="14" r="12" />
            <path d="M23 23 L30 30" />
        </svg>
        <input type="submit" style="opacity:0" value="go" />
    </form>

    <div style="width:11.5em;display:flex;">
        <button
            on:click={() => (states.plist = !states.plist)}
            class="plist {states.plist ? 'active' : ''}">
            PLAYLISTS
        </button>
        <button on:click={channels} class="plist active"> SUBSCRIBED </button>
    </div>
</section>
