<script>
    import { onMount } from "svelte";
    import data from "./data.json";

    let musicState = [],
        MBstats = [];

    const sendCMD = (appl, cmd, params = "") => {
        fetch(`/sys?app=${appl}&cmd=${cmd}&params=${params}`, {
            method: "POST",
        })
            .then((res) => res.json())
            .then((r) => {
                if (r.cmd == "musicState") musicState = [...r.data];
                if (r.cmd == "MBstats") MBstats = r.data;
            });
    };

    onMount(() => {
        setInterval(() => {
            sendCMD("music", "musicState");
            sendCMD("system", "smc");
        }, 1e5);
    });

    sendCMD("system", "smc");
    sendCMD("music", "musicState");
</script>

<style type="text/scss">
    article {
        padding: 5px;
        border-radius: 10px;
        margin-bottom: 5px;
        img {
            width: 36px;
            object-fit: cover;
            margin-right: 5px;
            height: 36px;
        }
    }
    button {
        border: 0;
        outline: 0;
        cursor: pointer;
        border-radius: 1.5em;
        padding: 0.33em 1em;
        color: #fff;
        &.prim {
            border: 1px solid #18f;
            background: #18f;
        }
        &.sec {
            border: 1px solid #fff;
            background: transparent;
        }
    }
</style>

<article class="blur">
    <div style="display:flex;">
        <img src={data.terminal.music.img} alt="" />
        <div style="font-weight:400;font-size:28px;">Music</div>
    </div>
    {@html musicState[1] ? `<p><b>${musicState[1]}</b> by ${musicState[0]} - <i>${musicState[2]}</i></p>` : ''}
    <div style="text-align:right;">
        <button
            class="prim"
            on:click={() => sendCMD('music', 'playpause')}>Play/Pause</button>
        <button class="sec" on:click={() => sendCMD('music', 'musicState')}>Get
            Music</button>
    </div>
</article>
<article class="blur">
    <div style="display:flex;">
        <img src={data.terminal.jupyter.img} alt="" />
        <div style="font-weight:400;font-size:28px;">Jupyter</div>
    </div>
    <div style="text-align:right;">
        <button class="prim" on:click={() => sendCMD('jupyter', 'start')}>
            Start</button>
        <button class="sec" on:click={() => sendCMD('jupyter', 'stop')}>
            Stop</button>
    </div>
</article>
<article class="blur">
    <div style="display:flex;">
        <img src={data.terminal.sysprefs.img} alt="" />
        <div style="font-weight:400;font-size:28px;">System</div>
    </div>
    <table>
        <tr>
            <td>CPU Temp:</td>
            <td>{MBstats.cpu}</td>
        </tr>
        <tr>
            <td>MBo Temp:</td>
            <td>{MBstats.board}</td>
        </tr>
        <tr>
            <td>Fan Speed:</td>
            <td>{MBstats.fan}</td>
        </tr>
    </table>
</article>
