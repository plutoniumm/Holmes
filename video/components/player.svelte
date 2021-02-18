<script>
    export let id;
    let maxwell,
        speed = 1.0;

    import { URLpars } from "../core/api";

    const [ext, yt, ald, sbx] = [
        "?autoplay=1&enablejsapi=1",
        "https://www.youtube-nocookie.com/embed/",
        "accelerometer;autoplay;clipboard-write;encrypted-media;picture-in-picture",
        "allow-scripts allow-same-origin",
    ];

    const clear = (() => {
        console.log("cleared");
        const defined = (v) => v !== null && v !== undefined;
        const timeout = setInterval(() => {
            if (defined([...document.querySelectorAll(".ad-showing")][0])) {
                const video = document.querySelector("video");
                if (defined(video)) video.currentTime = video.duration;
            }
        }, 500);
        return () => clearTimeout(timeout);
    })();

    const speedCh = (e) => {
        maxwell.contentWindow.postMessage(
            JSON.stringify({
                event: "command",
                func: "setPlaybackRate",
                args: [+speed, true],
            }),
            "*"
        );
    };

    setInterval(() => {
        maxwell.contentWindow.postMessage(
            JSON.stringify({
                event: "listening",
                func: "getPlaybackRate",
            }),
            "*"
        );
    }, 5e4);

    window.onmessage = (e) => {
        if (document.activeElement.tagName != "input")
            speed = JSON.parse(e.data).info.playbackRate || "1.0";
    };
</script>

<div id="wrapper">
    <iframe bind:this={maxwell} src={yt + id + ext} allow={ald} sandbox={sbx} />
    {#if !URLpars().zen}
        <div class="controls">
            <input type="text" on:change={speedCh} bind:value={speed} />
        </div>
    {/if}
</div>

<style type="text/scss">
    #wrapper {
        width: 100%;
        height: 100vh;
        iframe {
            width: 100%;
            height: 100%;
            border: 0;
            background: #111;
        }
        .controls {
            width: 20px;
            opacity: 0.6;
            position: absolute;
            bottom: 2.5em;
            display: flex;
            left: 95vw;
        }
        input {
            color: #fff;
            border: 0;
            background: transparent;
            outline: 0;
        }
    }
</style>
