<script>
    export let set;
</script>

<style type="text/scss">
    .boxes {
        background: #aaf;
        justify-content: space-between;
        .main {
            width: 33.33%;
            display: flex;
        }
        .grade {
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
    {#each set as show}
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
    {/each}
</section>
