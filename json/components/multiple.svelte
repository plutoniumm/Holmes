<script>
    export let set, state;

    let form;
    import { sourcer, histSearch } from "../functions.js";

    class Show {
        constructor(day, typ, rec, yr, grd, src, tags, x, stt) {
            this.day = new Date(day).toLocaleDateString("en-US");
            this.type = typ;
            this.record = rec;
            this.release = yr;
            this.grade = grd;
            this.source = src;
            this.tags = tags;
            this.speed = x;
            this.state = stt;
        }
    }

    const send = () => {
        const fr = (t) => new FormData(form).get(t);
        const show = new Show(
            fr("date"),
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
        fetch("/json/multiple", {
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
        <input name="type" type="text" class="grade" value="Web Series" />
    </div>
    <div class="inp-cont">
        <span class="label">Released</span>
        <input
            name="release"
            type="number"
            class="grade"
            min="1930"
            value="2017"
            max={new Date().getFullYear()}
        />
    </div>
    <div class="inp-cont">
        <span class="label">Grade</span>
        <input name="grade" type="text" class="grade" value="5" />
    </div>
    <div class="inp-cont">
        <span class="label">Speed</span>
        <input name="speed" type="text" class="grade" value="1.6" />
    </div>
    <div class="inp-cont">
        <span class="label">Source</span>
        <input type="text" name="source" class="grade" value="Netflix" />
    </div>
    <div class="inp-cont">
        <span class="label">Today</span>
        <input
            type="text"
            name="date"
            value={new Date().toLocaleDateString("en-US")}
            class="grade"
        />
        <input type="submit" value="submit" style="opacity:0;width:0;" />
    </div>
    <div class="inp-cont">
        <span class="label">Status</span>
        <input type="text" name="status" value="Completed" class="grade" />
    </div>
</form>
<br />
{#each set.filter((e) => {
    if (state != "") return histSearch(e, state);
    else return 1;
}) as show}
    <div class="boxes blurW">
        <div class="main w-33">
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
