<script>
    export let set;

    const send = () => {
        set = [show, ...set];
        fetch("/json/single", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(show),
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

<section>
    <form on:submit|preventDefault={send} class="boxes blurW">
        <div class="inp-cont">
            <span class="label">Name</span>
            <input type="text" class="grade" bind:value={show.record} />
        </div>
        <div class="inp-cont">
            <span class="label">Type</span>
            <input type="text" class="grade" bind:value={show.type} />
        </div>
        <div class="inp-cont">
            <span class="label">Released</span>
            <input type="text" class="grade" bind:value={show.release} />
        </div>
        <div class="inp-cont">
            <span class="label">Grade</span>
            <input type="text" class="grade" bind:value={show.grade} />
        </div>
        <div class="inp-cont">
            <span class="label">Speed</span>
            <input type="text" class="grade" bind:value={show.speed} />
        </div>
        <div class="inp-cont">
            <span class="label">Source</span>
            <input type="text" class="grade" bind:value={show.source} />
        </div>
        <div class="inp-cont">
            <span class="label">Today</span>
            <input type="text" class="grade" bind:value={show.day} />
            <input type="submit" value="submit" style="opacity:0;width:0;" />
        </div>
    </form>
    <br />
    {#each set as show}
        <div class="boxes blurW">
            <div class="main w-33">
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
    }
</style>
