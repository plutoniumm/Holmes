<script>
    import days from "../../config/days";

    const cols = ["#46f", "#3c7", "#e37"];
</script>

<style>
    .days {
        padding: 1em;
        border-radius: 10px;
        color: #fff;
        margin-bottom: 10px;
    }
</style>

{#each days as day}
    <div
        class="days"
        style="background:{cols[~~(Math.random() * cols.length)]}">
        <div style="font-size:3em;">
            {Math.abs(~~((new Date(day.date) - new Date()) / 864e5))}
        </div>
        {day.event}
    </div>
{/each}
