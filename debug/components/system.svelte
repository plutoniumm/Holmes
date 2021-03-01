<script>
    import { onMount } from "svelte";
    let MBstats = [];

    const sendCMD = (appl, cmd, params = "") => {
        fetch(`/sys?app=${appl}&cmd=${cmd}&params=${params}`, {
            method: "POST",
        })
            .then((res) => res.json())
            .then((r) => {
                if (r.cmd == "MBstats") MBstats = r.data;
            });
    };

    onMount(() => {
        setInterval(() => {
            sendCMD("system", "smc");
        }, 1e5);
    });

    sendCMD("system", "smc");
</script>

<section class="blur boxes">
    <div>
        <button class="prim" on:click={() => sendCMD("jupyter", "start")}>
            Jupyter</button
        >
        <button class="sec" on:click={() => sendCMD("jupyter", "stop")}>
            Stop</button
        >
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
</section>

<style type="text/scss">
    .boxes {
        width: 95%;
        max-height: 95vh;
        display: block;
        overflow-y: scroll;
    }
    img {
        width: 36px;
        object-fit: cover;
        margin-right: 5px;
        height: 36px;
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
