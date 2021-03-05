<script>
    export let set, state;

    let form;
    import { sourcer, histSearch } from "../functions.js";

    class Stream {
        constructor(type, record, year, source, why, recommendation) {
            this.type = type;
            this.record = record;
            this.release = year;
            this.source = source;
            this.why = why;
            this.recommendation = recommendation;
        }
    }

    const send = () => {
        const fr = (t) => new FormData(form).get(t);
        const show = new Stream(
            fr("type"),
            fr("record"),
            fr("release"),
            fr("source"),
            fr("why"),
            fr("recommendation")
        );
        set = [show, ...set];
        fetch("/data/track", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(show),
        });
    };
</script>

<form on:submit|preventDefault={send} class="boxes blurW" bind:this={form}>
    <div class="inp-cont">
        <span class="label">Name</span>
        <input name="record" type="text" class="grade" placeholder="Name" />
    </div>
    <div class="inp-cont">
        <span class="label">Type</span>
        <input name="type" type="text" class="grade" value="Movie" />
    </div>
    <div class="inp-cont">
        <span class="label">Released</span>
        <input
            name="release"
            type="number"
            class="grade"
            min="1930"
            value="2021"
            max={new Date().getFullYear()}
        />
    </div>
    <div class="inp-cont">
        <span class="label">Source</span>
        <input type="text" name="source" class="grade" value="Netflix" />
    </div>
    <div class="inp-cont">
        <span class="label">Why</span>
        <input type="text" name="why" value="Podcast" class="grade" />
    </div>
    <div class="inp-cont">
        <span class="label">Recommendation</span>
        <input
            type="text"
            name="recommendation"
            value="Completed"
            class="grade"
        />
        <input type="submit" value=" " style="width:0" />
    </div>
</form>
<br />
{#each set.filter((e) => {
    if (state != "") return histSearch(e, state);
    else return 1;
}) as show}
    <div class="boxes blurW">
        <div class="main flex w-33">
            <img src="./icons/{sourcer(show.source)}.svg" alt="" />
            <span style="font-size:1.25em;text-format:capitalize">
                {show.record.length > 20
                    ? show.record.slice(0, 20) + "..."
                    : show.record} ({show.release})
            </span>
        </div>
        <div class="w-33 t-rhs">{show.recommendation}</div>
        <div class="w-33 t-rhs">({show.type}) {show.why}</div>
    </div>
{/each}
