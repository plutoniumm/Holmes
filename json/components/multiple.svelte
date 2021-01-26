<script>
    export let set;
    let grade = 0;

    const send = () => {
        set = [show, ...set];
        fetch("/json/multiple", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(show),
        })
            .then((res) => res.json())
            .then((r) => {
                if (r.status == "Done") window.location.reload();
            });
    };
    let show = {
        day: new Date().toLocaleDateString("en-US"),
        type: "Web Series",
        record: "Name",
        release: "201",
        grade: 5,
        source: "Netflix",
        tags: "",
        speed: "1.8",
        state: "Completed",
    };
</script>

<style type="text/scss">
    .boxes {
        background: #88f;
        justify-content: space-between;
        &:first-child {
            width: 95%;
            div,
            input {
                position: relative;
                text-align: left;
                font-size: 1em;
                width: 100px;
                flex: 1;
            }
        }
        &:nth-child(2) {
            width: 95%;
        }
        .main {
            width: 33.33%;
            display: flex;
        }
        .grade {
            background: transparent;
            outline: none;
            border: 0;
            color: #fff;
            text-align: right;
            width: 33.33%;
        }
        .date {
            width: 33.33%;
            text-align: right;
        }
        .label {
            font-size: 0.66em;
            position: absolute;
            top: -9px;
            left: 0;
            color: #fff8;
        }
    }
</style>

<section>
    <form on:submit|preventDefault={send} class="boxes">
        <div class="main">
            <span style="font-size:1.25em;text-format:capitalize"> Adder </span>
        </div>
        <div>
            <span class="label">Name</span>
            <input type="text" class="grade" bind:value={show.record} />
        </div>
        <div>
            <span class="label">Released</span>
            <input type="text" class="grade" bind:value={show.release} />
        </div>
        <div>
            <span class="label">Grade</span>
            <input type="text" class="grade" bind:value={show.grade} />
        </div>
        <div>
            <span class="label">Speed</span>
            <input type="text" class="grade" bind:value={show.speed} />
        </div>
        <div>
            <span class="label">Source</span>
            <input type="text" class="grade" bind:value={show.source} />
        </div>
        <div>
            <span class="label">Today</span>
            <input type="text" class="grade" bind:value={show.day} />
        </div>
        <div>
            <span class="label">Status</span>
            <input type="text" class="grade" bind:value={show.state} />
        </div>
        <input type="submit" value="submit" style="opacity:0" />
    </form>
    <div class="boxes">
        <div class="main">
            <span style="font-size:1.25em;text-format:capitalize">
                Filterer
            </span>
        </div>
        <input type="text" class="grade" bind:value={grade} />
        <div class="date">&nbsp;</div>
    </div>
    {#each set as show}
        {#if show.grade >= (grade || 0)}
            <div class="boxes">
                <div class="main">
                    <span style="font-size:1.25em;text-format:capitalize">
                        {show.record.length > 20 ? show.record.slice(0, 20) + '...' : show.record}
                    </span>
                    <svg
                        height="20"
                        width="32"
                        viewBox="0 0 40 25"
                        style="background:#888;border-radius:8px;margin:3px 5px;">
                        <text x="8" y="18" fill="#fff">{show.speed}</text>
                    </svg>
                </div>
                <div class="grade">{show.grade}</div>
                <div class="date">
                    {new Date(show.day).toLocaleString('en-GB', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                    })}
                </div>
            </div>
        {/if}
    {/each}
</section>
