<script>
    export let set;

    import { sourcer } from "../functions.js";

    const send = () => {
        const t = show;
        set = [t, ...set];
        fetch("/json/track", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(show),
        });
    };
    let show = {
        type: "Movie",
        record: "Don't Fuck with Cats",
        release: "2019",
        source: "Netflix",
        stars: "",
        size: "",
        why: "8",
    };
</script>

<section>
    <form on:submit|preventDefault={send} class="boxes blurW">
        <div class="inp-cont">
            <span class="label">Type</span>
            <input type="text" class="grade" bind:value={show.type} />
        </div>
        <div class="inp-cont">
            <span class="label">Name</span>
            <input type="text" class="grade" bind:value={show.record} />
        </div>
        <div class="inp-cont">
            <span class="label">Released</span>
            <input type="text" class="grade" bind:value={show.release} />
        </div>
        <div class="inp-cont">
            <span class="label">Source</span>
            <input type="text" class="grade" bind:value={show.source} />
        </div>
        <div class="inp-cont">
            <span class="label">Size</span>
            <input type="text" class="grade" bind:value={show.size} />
        </div>
        <div class="inp-cont">
            <span class="label">Stars</span>
            <input type="text" class="grade" bind:value={show.stars} />
        </div>
        <div class="inp-cont">
            <span class="label">Why</span>
            <input type="text" class="grade" bind:value={show.why} />
            <input type="submit" value="submit" style="opacity:0;width:0;" />
        </div>
    </form>
    <br />
    {#each set as show}
        <div class="boxes blurW">
            <div class="main w-33">
                <img src="./icons/{sourcer(show.source)}.svg" alt="" />
                <span style="font-size:1.25em;text-format:capitalize">
                    {show.record.length > 20
                        ? show.record.slice(0, 20) + "..."
                        : show.record} ({show.release})
                </span>
            </div>
            <div class="w-33 t-rhs">{show.stars}</div>
            <div class="w-33 t-rhs">{show.size}</div>
            <div class="w-33 t-rhs">({show.type}) {show.why}</div>
        </div>
    {/each}
</section>

<style type="text/scss">
    input {
        color: #fff;
        width: 100px;
    }
    .inp-cont {
        flex: 1;
    }
    .main {
        display: flex;
        svg {
            background: #888;
            border-radius: 8px;
            margin: 3px 5px;
        }
        img {
            width: 24px;
            height: 24px;
            border-radius: 5px;
            object-fit: contain;
            margin: 0 5px;
        }
    }
</style>
