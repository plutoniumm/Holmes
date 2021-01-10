<script>
      export let days;
</script>

<style>
      .days {
            overflow-y: scroll;
            display: flex;
      }
</style>

<div class="days">
      {#each days as day}
            <div class="box" style="font-size:1.75em;">
                  <span
                        style="text-transform:uppercase;font-size:0.75em;color:#999">
                        {day.name}
                  </span>
                  <br />
                  {Math.round((new Date() - new Date(day.date)) / (1000 * 86400))}
            </div>
      {/each}
</div>
