<script>
    export let id;
    let maxwell;
    let config = "?autoplay=1&enablejsapi=1";

    const clear = (() => {
        const defined = (v) => v !== null && v !== undefined;
        const timeout = setInterval(() => {
            if (defined([...document.querySelectorAll(".ad-showing")][0])) {
                const video = document.querySelector("video");
                if (defined(video)) video.currentTime = video.duration;
            }
        }, 500);
        return () => clearTimeout(timeout);
    })();

    // setInterval(() => {
    //     maxwell.contentWindow.postMessage(
    //         // JSON.stringify({ event: "command", func: "getCurrentTime" }),
    //         JSON.stringify({ event: "listening", func: "getDuration" }),
    //         // JSON.stringify({ event: "listening", func: "getDuration" }),
    //         "*"
    //     );
    // }, 5000);

    // window.onmessage = (e) => {
    //     console.log(e);
    // };
</script>

<style type="text/scss">
    #wrapper {
        width: 100%;
        height: 99.75vh;
        .main {
            width: 100%;
            height: 100%;
            border: 0;
            background: #111;
        }
    }
</style>

<div id="wrapper">
    <iframe
        bind:this={maxwell}
        id="main"
        class="main"
        title="video"
        src="https://www.youtube-nocookie.com/embed/{id + config}"
        allow="accelerometer;autoplay;clipboard-write;encrypted-media;picture-in-picture"
        sandbox="allow-scripts allow-same-origin allow-presentation"
        allowfullscreen />
</div>
