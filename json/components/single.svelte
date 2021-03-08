<script>
    export let set, state;

    let form;
    import { sourcer, histSearch } from "../functions.js";

    class Movie {
        constructor(day, typ, rec, yr, grd, src, x) {
            this.day = new Date(day).toLocaleDateString("en-US");
            this.type = typ;
            this.record = rec;
            this.release = yr;
            this.grade = grd;
            this.source = src;
            this.speed = x;
        }
    }

    const send = () => {
        const fr = (t) => new FormData(form).get(t);
        const t = new Movie(
            fr("date"),
            fr("type"),
            fr("record"),
            fr("release"),
            fr("grade"),
            fr("source"),
            fr("speed")
        );
        set = [t, ...set];
        fetch("/data/single", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(t),
        });
    };
    let show = {
        day: new Date().toLocaleDateString("en-US"),
        type: "Documentary",
        record: "Name",
        release: "201",
        grade: 5,
        source: "Netflix",
        speed: "1.8",
    };
</script>

<form on:submit|preventDefault={send} class="boxes blurW" bind:this={form}>
    <fieldset class="w-20">
        <legend class="label">Name</legend>
        <input name="record" type="text" placeholder="Name" />
    </fieldset>
    <fieldset>
        <legend class="label">Type</legend>
        <input name="type" list="types" type="text" value="Movie" />
        <datalist id="types">
            {#each ["Movie", "Documentary", "Anime"] as type}
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
            {#each ["Netflix", "PrimeVideo", "Torrent", "KissMovies", "Web", "DC++", "AppleTV+", "Theatre"] as type}
                <option value={type} />{/each}
        </datalist>
    </fieldset>
    <fieldset>
        <legend class="label">Today</legend>
        <input type="text" class="grade" bind:value={show.day} />
        <input type="submit" value="submit" style="opacity:0;width:0;" />
    </fieldset>
</form>
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
                    : show.record}
            </span>
            <svg
                height="20"
                width="32"
                viewBox="0 0 40 25"
                style="background:#888;border-radius:8px;margin:3px 5px;"
            >
                <text x="8" y="18" fill="#fff">{show.speed}</text>
            </svg>
        </div>
        <div class="w-33 t-rhs">{show.grade}</div>
        <div class="w-33 t-rhs">
            {new Date(show.day).toLocaleString("en-GB", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
            })}
        </div>
    </div>
{/each}
