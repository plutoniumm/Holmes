<script>
    export let set, state;

    let form;
    import { sourcer, histSearch } from "../functions.js";

    class Show {
        constructor(day, type, record, year, grade, source, tags, x, state) {
            this.day = new Date(day).toLocaleDateString("en-US");
            this.type = type;
            this.record = record;
            this.release = year;
            this.grade = grade;
            this.source = source;
            this.tags = tags;
            this.speed = x;
            this.state = state;
        }
    }

    const send = () => {
        const fr = (t) => new FormData(form).get(t);
        const show = new Show(
            new Date().toLocaleDateString("en-US"),
            fr("type"),
            fr("record"),
            fr("release"),
            fr("grade"),
            fr("source"),
            fr("tags"),
            fr("speed"),
            fr("status")
        );
        set = [show, ...set];
        fetch("/data/multiple", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(show),
        });
    };
</script>

<form on:submit|preventDefault={send} class="boxes blurW" bind:this={form}>
    <fieldset class="w-20">
        <legend class="label">Name</legend>
        <input name="record" type="text" placeholder="Name" />
    </fieldset>
    <fieldset>
        <legend class="label">Type</legend>
        <input name="type" list="types" type="text" value="Web Series" />
        <datalist id="types">
            {#each ["Web Series", "TV Show", "Anime"] as type}
                <option value={type} />{/each}
        </datalist>
    </fieldset>
    <fieldset>
        <legend class="label">Released</legend>
        <input
            name="release"
            type="number"
            min="1930"
            value="2019"
            max={new Date().getFullYear()}
        />
    </fieldset>
    <fieldset>
        <legend class="label">Grade</legend>
        <input
            name="grade"
            type="text"
            value={set
                .reduce(
                    (avg, value, _, { length }) => avg + +value.grade / length,
                    0
                )
                .toFixed(2)}
        />
    </fieldset>
    <fieldset>
        <legend class="label">Speed</legend>
        <input name="speed" type="text" value="1.6" />
    </fieldset>
    <fieldset>
        <legend class="label">Source</legend>
        <input type="text" list="sources" name="source" value="Netflix" />
        <datalist id="sources">
            {#each ["Netflix", "PrimeVideo", "Torrent", "KissAnime", "Web", "DC++", "AppleTV+"] as type}
                <option value={type} />{/each}
        </datalist>
    </fieldset>
    <fieldset>
        <legend class="label">Status</legend>
        <input type="text" name="status" value="Completed" />
    </fieldset>
</form>
<br />
{#each set.filter((e) => {
    return state ? histSearch(e, state) : 1;
}) as show}
    <div class="boxes blurW">
        <div class="main flex w-33">
            <img src="./icons/{sourcer(show.source)}.svg" alt="" />
            <span style="font-size:1.25em;text-format:capitalize">
                {show.record.length > 20
                    ? show.record.slice(0, 20) + "..."
                    : show.record}
            </span>
            <svg height="20" width="32" viewBox="0 0 40 25">
                <text x="8" y="18" fill="#fff">{show.speed}</text>
            </svg>
        </div>
        <div class="w-33 t-rhs">{show.grade}</div>
        <div class="w-33 t-rhs">
            {new Date(show.day).toLocaleString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
            })}
        </div>
    </div>
{/each}
