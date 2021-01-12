<script>
    import days from "../../config/days";
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
        style="background:{Math.round(Math.random()) ? '#88f' : '#8f8'}">
        <div style="font-size:3em;">
            {Math.abs(~~((new Date(day.date) - new Date()) / 864e5))}
        </div>
        {day.event}
    </div>
{/each}
<p>
    {[...Array(150)]
        .map((i) => (~~(Math.random() * 36)).toString(36))
        .map((o) => (Math.round(Math.random()) ? o : o.toUpperCase()))
        .join('')}
</p>
