<script>
      import data from "./links.json";
      import Quick from "../micro/quick.svelte";
</script>

<style>
      .links,
      .quickCont {
            display: flex;
            justify-content: center;
            align-items: center;
            word-wrap: break-word;
            text-align: center;
      }
      .links {
            position: fixed;
            bottom: 0.5em;
            width: 100%;
      }
      .quickCont {
            width: auto;
            border-radius: 10px;
            background: #2224;
            backdrop-filter: blur(32px);
            -moz-backdrop-filter: blur(32px);
            -webkit-backdrop-filter: blur(32px);
      }
      @media (max-width: 768px) {
            .links {
                  flex-wrap: wrap;
            }
      }
</style>

<section class="links">
      <div class="quickCont">
            {#each data as link}
                  <Quick {link} />
            {/each}
      </div>
</section>
