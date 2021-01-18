<script>
    import { onMount } from "svelte";

    let vol = "75",
        musicState = [];

    const sendCMD = (appl, cmd, params = "") => {
        fetch(
            `http://localhost:4000/sys?app=${appl}&cmd=${cmd}&params=${params}`,
            { method: "POST" }
        )
            .then((res) => res.json())
            .then((r) => {
                if (r.cmd == "volState") vol = r.data;
                if (r.cmd == "musicState") musicState = [...r.data];
            });
    };

    onMount(() => {
        setInterval(() => sendCMD("system", "volState"), 1e5);
        setInterval(() => sendCMD("music", "musicState"), 1e4);
    });

    sendCMD("music", "musicState");
    sendCMD("system", "volState");
</script>

<style type="text/scss">
    article {
        padding: 5px;
        border-radius: 10px;
        background: #112;
        margin: 5px 0;
    }
    input,
    svg {
        border: 0;
        outline: none;
        padding: 5px;
        color: #fff;
        fill: transparent;
        border-radius: 5px;
        margin: 5px;
        background: #334;
        height: 32px;
    }
    input {
        font-size: 1.2em;
        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
    }
    svg {
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 2;
        cursor: pointer;
        stroke: #fff;
        transition: background 0.2s ease;
        &:hover {
            background: #445;
        }
    }
</style>

<article style="display:flex;">
    <img
        src="https://static.wikia.nocookie.net/logopedia/images/c/cb/Apple_Music_Icon_RGB_lg_073120.svg"
        alt=""
        style="width:67px;margin:5px;height:67px" />
    <form
        on:submit|preventDefault={() => sendCMD('system', 'volume', vol || 75)}
        style="display:flex;flex-wrap:wrap;">
        <div style="padding:2px 7px;width:100%;">MUSIC</div>
        <input type="number" max="100" bind:value={vol} style="width: 32px;" />
        <svg viewBox="0 0 24 30" on:click={() => sendCMD('music', 'playpause')}>
            <path stroke-width="4" d="M3 3 L3 29" />
            <path fill="#fff" d="M10 2 L10 30 24 16 Z" />
        </svg>
    </form>
    <div style="text-align:right;">
        {musicState[0] ? musicState[0] + ' by' : ''}
        {musicState[1] || ''}
        <br />
        {musicState[2] || ''}
        <br />
        <svg
            viewBox="0 0 32 32"
            on:click={() => sendCMD('music', 'musicState')}>
            <path
                stroke-width="2.5"
                d="M9 22 C0 23 1 12 9 13 6 2 23 2 22 10 32 7 32 23 23 22 M11 26 L16 30 21 26 M16 16 L16 30" />
        </svg>
    </div>
</article>
