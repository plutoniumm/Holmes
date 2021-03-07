<script>
      import { onMount } from "svelte";
      import { engine, preprocessor } from "../../public/shared/js/samurai";

      let magic;

      const go = (e) => {
            const send = engine(magic.value.toLowerCase());
            switch (e.keyCode) {
                  case 40:
                        magic.value = "!" + send.key + " " + suggList[0];
                        break;
                  case 38:
                        magic.value = "!" + send.key + " " + suggList[1];
                        break;
                  case 13:
                        navigator.sendBeacon(
                              `/log?key=${send.key}&params=${send.query
                                    .replace("!", "")
                                    .replace(send.key + " ", "")
                                    .replace(send.key + ":", "")}`
                        );
                        window.location.href = preprocessor(send);
                        break;
                  default:
                        suggI = null;
                        break;
            }
            return send;
      };

      onMount(() => {
            setTimeout(magic.focus(), 1e3);
      });
</script>

<section class="flex-col" style="justify-content: center;align-items: center;">
      <br />
      <form class="flex" on:submit|preventDefault>
            <div class="wrapper flex p-5">
                  <img id="engineImage" src="./icons/Basic.svg" alt="" />
                  <input
                        on:keyup={go}
                        bind:this={magic}
                        id="magic"
                        required
                        size="150"
                  />
            </div>
            <input id="submit" type="submit" value="SEARCH" />
      </form>
      <div style="width:calc(100% - 1em);padding:0.5em;margin-top:0.5em;">
            <ul id="autoComplete" class="blur" />
      </div>
</section>

<style type="text/scss">
      form {
            padding-top: 22.5%;
            justify-content: center;
            .wrapper {
                  background: transparent;
                  border-bottom: 3px solid #a00;
                  font-size: 1.25rem;
                  align-items: center;
                  width: calc(80vw - 1em);
                  img {
                        object-fit: contain;
                        width: 44px;
                        height: 44px;
                        border-radius: 5px;
                  }
                  #magic {
                        padding: 0.25em 0.5em;
                        font-size: 1.75rem;
                        overflow: hidden;
                        background: transparent;
                        color: white;
                  }
            }
            #submit {
                  color: #a00;
                  cursor: pointer;
                  position: relative;
                  right: 6%;
                  top: 8px;
                  font-size: 12px;
            }
      }
      #autoComplete {
            width: calc(75% - 1.5em);
            padding: 0.5em 0.75em;
            opacity: 1;
            margin: 0 auto;
            list-style-type: none;
            border-radius: 1em;
            &:empty {
                  opacity: 0;
            }
      }
</style>
