<script>
      import { onMount } from "svelte";
      import { checkKey, startsWith, preprocessor } from "../core/micro";

      export let sites;
      console.log(sites);
      let raw = "",
            magic,
            ic,
            staticBox;
      $: key = raw.split(":")[0].split(" ")[0].toLowerCase();
      $: send = "";

      const fx = (p) => {
            const val = +p.split(" ")[0];
            const frm = p.split(" ")[1];
            const fin = p.split(" ")[2];
            fetch(`https://api.exchangerate-api.com/v4/latest/${frm}`)
                  .then((res) => res.json())
                  .then((res) => {
                        const rate = res.rates[fin];
                        const ans = `${val} ${frm} = ${+rate * val} ${fin}`;
                        console.log(ans);
                        staticBox.innerHTML += "<br>" + ans;
                  });
      };

      const go = () => {
            let term;
            if (checkKey(key)) {
                  if (startsWith(raw, key + " ")) {
                        term = raw.replace(key + " ", "");
                        // if (term != "") sug(term);
                        send = sites[key].prelink + term + sites[key].postlink;
                  }
                  if (startsWith(raw, key + ":")) {
                        term = raw.replace(key + ":", "");
                        send = sites[key][term];
                  }
                  ic.src = `./icons/${sites[key].name}.svg`;
            }
            if (raw != "" && !checkKey(key)) {
                  key = "g";
                  term = raw;
                  // if (term != "") sug(term);
                  send = sites[key].prelink + term + sites[key].postlink;
                  ic.src = `./icons/${sites[key].name}.svg`;
            }
      };

      const metal = () => {
            if (magic.value == "") {
                  alert("Please Enter A search Term");
            } else {
                  if (startsWith(raw, "> ")) {
                        let exec = raw.replace("> ", "");
                        let fn = exec.split(" ")[0];
                        let param = exec.replace(fn + " ", "");
                        switch (fn) {
                              case "fx":
                                    fx(param);
                                    break;
                              default:
                                    alert("invalid func");
                                    break;
                        }
                        // if (fn == "t") {count(+param);}
                        // if (fn == "cal" ||fn == "calc" ||fn == "eval" ||fn == "solve") {calc(param);}
                  } else {
                        if (
                              startsWith(raw, "https://") ||
                              startsWith(raw, "http://")
                        ) {
                              window.location.href = raw.replace(
                                    "http://",
                                    "https://"
                              );
                        } else {
                              const scr = preprocessor(key);
                              eval(scr);
                        }
                  }
            }
      };

      onMount(() => {
            magic.focus();
      });
</script>

<style type="text/scss">
      form {
            display: flex;
            justify-content: center;
            .wrapper {
                  background: #222;
                  border: 1px solid #ddd6;
                  font-size: 1.5rem;
                  display: flex;
                  align-items: center;
                  border-radius: 1em;
                  width: 80vw;
                  padding: 0.25em 0.5em;
                  img {
                        // background: #fff8;
                        object-fit: contain;
                        width: 44px;
                        height: 44px;
                        border-radius: 34px;
                  }
                  #magic {
                        padding: 0.5em;
                        font-size: 2rem;
                        overflow: hidden;
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
      <form on:submit|preventDefault={metal}>
            <div class="wrapper" style="display:flex">
                  <div class="icon">
                        <img bind:this={ic} src="./icons/Basic.svg" alt="" />
                  </div>
                  <input
                        on:keyup={go}
                        bind:this={magic}
                        id="magic"
                        bind:value={raw}
                        size={raw.length > 40 ? 40 : raw.length} />
                  <div>follower</div>
            </div>
            <input type="submit" style="display:none" />
      </form>
      <div bind:this={staticBox} id="staticBox" />
</section>
