<script>
      export let data;
      import Quick from "../micro/quick.svelte";

      console.log(data);
</script>

<style type="text/scss">
      .links,
      .quickCont {
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
      }
      .links {
            position: fixed;
            bottom: 0.5em;
      }
      .quickCont {
            background: #1118;
            word-wrap: break-word;
      }
</style>

<section class="links" style="width:100%">
      <div class="quickCont" style="width:80%;">
            {#each data as link}
                  <Quick {link} />
            {/each}
      </div>
</section>
