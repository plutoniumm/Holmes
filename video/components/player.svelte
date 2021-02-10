<script>
    export let id;
    let maxwell,
        speed = 1.0;
    let config = "?autoplay=1&enablejsapi=1";

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
    <iframe
        bind:this={maxwell}
        id="main"
        class="main"
        title="video"
        src="https://www.youtube-nocookie.com/embed/{id + config}"
        allow="accelerometer;autoplay;clipboard-write;encrypted-media;picture-in-picture"
        sandbox="allow-scripts allow-same-origin"
        allowfullscreen
    />
    <div class="controls">
        <input type="text" on:change={speedCh} bind:value={speed} />
    </div>
</div>

<style type="text/scss">
    #wrapper {
        width: 100%;
        height: 100vh;
        .main {
            width: 100%;
            height: 100%;
            border: 0;
            background: #111;
        }
        .controls {
            width: 100%;
            opacity: 0.6;
            position: absolute;
            bottom: 2.5em;
            display: flex;
            left: 95vw;
            font-size: 20px;
        }
        input {
            color: #fff;
            border: 0;
            background: transparent;
            outline: 0;
            font-size: 1.2em;
        }
    }
</style>
