<script>
      export let days;
</script>

<style type="text/scss">
      section {
            overflow-y: scroll;
            padding: 1em 0;
            padding-top: 2em;
            display: flex;
            .track {
                  height: 70px;
                  width: 150px;
                  background: #222;
                  border-radius: 20px;
                  font-size: 1.75em;
                  padding: 0.25em 0.5em;
                  margin: 0 7px;
            }
      }
</style>

<section>
      {#each days as day}
            <div class="track">
                  <span
                        style="text-transform:uppercase;font-size:0.75em;color:#999">
                        {day.name}
                  </span>
                  <br />
                  {Math.round((new Date() - new Date(day.date)) / (1000 * 86400))}
            </div>
      {/each}
</section>
