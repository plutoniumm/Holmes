<script>
      import { onMount } from "svelte";

      export let sites;
      console.log(sites);
      let raw = "",
            magic;

      const submitHandler = () => {
            console.log(raw);
      };

      onMount(() => {
            magic.focus();
      });
</script>

<style type="text/scss">
      form {
            .wrapper {
                  background: #222;
                  border: 1px solid #ddd6;
                  border-radius: 1em;
                  padding: 1em;
                  #magic {
                        padding: 0.5em;
                        background: transparent;
                        color: white;
                        outline: none;
                        border: 0;
                  }
            }
      }
</style>

<section
      style="display:flex;justify-content: center;align-items: center;flex-direction: column;">
      {new Date().toLocaleTimeString('en-GB').slice(0, -3)}
      <form on:submit={submitHandler}>
            <div class="wrapper" style="display:flex">
                  <div class="icon">icon</div>
                  <input
                        bind:this={magic}
                        id="magic"
                        bind:value={raw}
                        size={raw.length > 40 ? 40 : raw.length} />
                  <div>follower</div>
            </div>
            <input type="submit" style="display:none" />
      </form>
</section>
