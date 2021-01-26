<script>
    export let set;
    let grade = 0;
</script>

<style type="text/scss">
    .boxes {
        background: #88f;
        justify-content: space-between;
        &:first-child {
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
    }
</style>

<section>
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
