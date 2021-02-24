<script>
    let dir = [];
    let ur = "./";

    import { typecheck } from "../core/local";

    const fetcher = (e) => {
        if (e.target.dataset.type == "dir") {
            ur = ur + e.target.innerText + "/";
            fetch("/sys/fs?ur=" + encodeURIComponent(ur))
                .then((res) => res.json())
                .then((r) => (dir = r));
        } else {
            const len = e.target.innerText.split(".");
            const filetype = len[len.length - 1];
            typecheck(filetype);
        }
    };

    fetch("/sys/fs?ur=" + ur)
        .then((res) => res.json())
        .then((r) => (dir = r));
</script>

<section>
    <div class="file" data-type="dir" on:click={fetcher}>../</div>
    {#each dir.sort() as d}
        <div
            class={d.slice(-6).includes(".") ? "file" : "direc"}
            data-type={d.slice(-6).includes(".") ? "file" : "dir"}
            on:click={fetcher}
        >
            {d}
        </div>
    {/each}
</section>

<style type="text/scss">
    section {
        border-radius: 10px;
        width: 80%;
        overflow: hidden;
        margin: 50px auto;
    }
    .file,
    .direc {
        padding: 5px;
        width: 100%;
        background: #333;
        cursor: pointer;
        border-bottom: 1px solid #444;
        transition: background 0.2s ease;
        &:hover {
            background: #444;
        }
    }
    .direc {
        font-weight: 400;
    }
</style>
