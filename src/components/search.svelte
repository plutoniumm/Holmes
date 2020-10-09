<script>
      import { onMount } from "svelte";
      import { startsWith, preprocessor, sug } from "../core/micro";

      export let sites;
      let raw = "",
            autoComplete,
            magic,
            ic,
            dynaBox,
            staticBox;
      $: key = raw
            ? raw.split(":")[0].split(" ")[0].toLowerCase() in sites
                  ? raw.split(":")[0].split(" ")[0].toLowerCase()
                  : "g"
            : null;
      $: send = "";
      const fx = (p) => {
            const t = p.split(" ");
            const val = (+t[0]).toFixed(2);
            const frm = t[1].toUpperCase();
            const fin = t[2].toUpperCase();
            fetch(`https://api.exchangerate-api.com/v4/latest/${frm}`)
                  .then((res) => res.json())
                  .then((r) => {
                        const rate = r.rates[fin];
                        const ans = `${val} ${frm} = ${(+rate * val).toFixed(
                              2
                        )} ${fin}`;
                        staticBox.innerHTML += "<br>" + ans;
                  });
      };
      const go = (e) => {
            let term;
            if (raw == "") {
                  autoComplete.innerHTML = "";
                  ic.src = "./icons/Basic.svg";
            }
            switch (e.keyCode) {
                  case 40:
                        magic.value = key + " " + suggList[0];
                        break;
                  case 38:
                        magic.value = key + " " + suggList[1];
                        break;
                  default:
                        suggI = null;
                        break;
            }
            term = magic.value.replace(key + " ", "");
            term ? sug(term) : null;
            send = sites[key].prelink + term + (sites[key].postlink || "");
            if (startsWith(raw, key + ":")) {
                  term = raw.replace(key + ":", "");
                  send = sites[key][term];
            }
            ic.src = `./icons/${sites[key].name}.svg`;
      };
      const metal = () => {
            if (startsWith(raw, "> ")) {
                  const exec = raw.replace("> ", "");
                  const fn = exec.split(" ")[0];
                  const param = exec.replace(fn + " ", "");
                  switch (fn) {
                        case "fx":
                              fx(param);
                              break;
                        default:
                              alert("invalid func");
                              break;
                  }
                  // if (fn == "t") {count(+param);}
            } else {
                  navigator.sendBeacon(
                        `http://localhost:4000/log?key=${key}&params=${raw
                              .replace(key + " ", "")
                              .replace(key + ":", "")}`
                  );
                  const scr = preprocessor(key);
                  eval(scr);
            }
      };

      onMount(() => {
            setTimeout(magic.focus(), 500);
      });
</script>

<style type="text/scss">
      form {
            display: flex;
            justify-content: center;
            .wrapper {
                  background: #222;
                  border: 1px solid #ddd6;
                  font-size: 1.25rem;
                  display: flex;
                  align-items: center;
                  border-radius: 1.5em;
                  width: calc(80vw - 1em);
                  padding: 0.25em 0.5em;
                  img {
                        // background: #fff8;
                        object-fit: contain;
                        width: 44px;
                        height: 44px;
                        border-radius: 34px;
                  }
                  #magic {
                        padding: 0.25em 0.5em;
                        font-size: 1.75rem;
                        overflow: hidden;
                        background: transparent;
                        color: white;
                        outline: none;
                        border: 0;
                  }
            }
      }
      #autoComplete {
            background: #222;
            width: calc(75% - 1.5em);
            padding: 0.5em 0.75em;
            margin: 0 auto;
            list-style-type: none;
            border-radius: 1em;
            transition: padding 0.3s ease;
            &:empty {
                  padding: 0;
            }
            li {
                  border-radius: 1em;
                  padding: 0.2em 0.5em;
                  &:first-child {
                        padding-top: 0.5em;
                  }
            }
      }
</style>

<section
      style="display:flex;justify-content: center;align-items: center;flex-direction: column;">
      <br />
      <form on:submit|preventDefault={metal}>
            <div class="wrapper" style="display:flex">
                  <div class="icon">
                        <img bind:this={ic} src="./icons/Basic.svg" alt="" />
                  </div>
                  <input
                        on:keyup={go}
                        bind:this={magic}
                        id="magic"
                        required
                        bind:value={raw}
                        size="100" />
            </div>
            <input type="submit" style="display:none" />
      </form>
      <div style="width:calc(100% - 1em);padding:0.5em;margin-top:0.5em;">
            <ul bind:this={autoComplete} id="autoComplete" />
      </div>
      <div bind:this={staticBox} id="staticBox" />
</section>
