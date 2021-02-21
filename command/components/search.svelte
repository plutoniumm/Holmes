<script>
      import { onMount } from "svelte";
      import { startsWith, preprocessor, sug } from "../core/micro";

      export let sites;
      let raw = "s ",
            autoComplete,
            magic,
            ic,
            staticBox;
      $: key = raw
            ? raw.split(":")[0].split(" ")[0].toLowerCase() in sites
                  ? raw.split(":")[0].split(" ")[0].toLowerCase()
                  : "s"
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
            autoComplete.style.opacity = 1;
            if (raw == "") {
                  autoComplete.style.opacity = 0;
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
            if (term) sug(term);
            send = sites[key].prelink + term + (sites[key].postlink || "");
            if (startsWith(raw, key + ":"))
                  send = sites[key][raw.replace(key + ":", "")];
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
            } else {
                  navigator.sendBeacon(
                        `/log?key=${key}&params=${raw
                              .replace(key + " ", "")
                              .replace(key + ":", "")}`
                  );
                  const scr = preprocessor(key);
                  eval(scr);
            }
      };

      onMount(() => setTimeout(magic.focus(), 1e3));
</script>

<section class="flex-col" style="justify-content: center;align-items: center;">
      <br />
      <form class="flex" on:submit|preventDefault={metal}>
            <div class="wrapper flex">
                  <div class="icon">
                        <img bind:this={ic} src="./icons/Basic.svg" alt="" />
                  </div>
                  <input
                        on:keyup={go}
                        bind:this={magic}
                        id="magic"
                        required
                        bind:value={raw}
                        size="150"
                  />
            </div>
            <input
                  type="submit"
                  value="SEARCH"
                  style="position:relative;right:6%;top:8px;font-size:12px;color:#a00;cursor:pointer;"
            />
      </form>
      <div style="width:calc(100% - 1em);padding:0.5em;margin-top:0.5em;">
            <ul bind:this={autoComplete} id="autoComplete" />
      </div>
      <div bind:this={staticBox} id="staticBox" />
</section>

<style type="text/scss">
      form {
            padding-top: 22.5%;
            justify-content: center;
            .wrapper {
                  background: transparent;
                  // border: 3px solid;
                  // border-image: linear-gradient(to right, #ff0, #0ff, #faa) 1 1
                  //       100%;
                  // border-top: 0;
                  border-bottom: 3px solid #a00;
                  font-size: 1.25rem;
                  align-items: center;
                  width: calc(80vw - 1em);
                  padding: 5px 0.5em;
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
                        outline: none;
                        border: 0;
                  }
            }
      }
      #autoComplete {
            background: #2228;
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            width: calc(75% - 1.5em);
            padding: 0.5em 0.75em;
            margin: 0 auto;
            list-style-type: none;
            border-radius: 1em;
            &:empty {
                  padding: 0;
            }
      }
      @media (max-width: 768px) {
            .wrapper {
                  border-radius: 5px;
                  width: calc(90vw - 1em);
                  img {
                        width: 32px;
                        height: 32px;
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
</style>
