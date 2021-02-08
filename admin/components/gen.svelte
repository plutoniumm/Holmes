<script>
    export let days;
</script>

{#each days as day}
    <div class="days blur">
        <div style="font-size:3em;">
            {Math.abs(~~((new Date(day.date) - new Date()) / 864e5))}
        </div>
        {day.event}
    </div>
{/each}

<style>
    .days {
        padding: 1em;
        border-radius: 10px;
        color: #fff;
        margin-bottom: 10px;
    }
</style>
