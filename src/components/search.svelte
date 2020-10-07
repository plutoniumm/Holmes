<script>
      import { onMount } from "svelte";
      import { startsWith, preprocessor } from "../core/micro";

      export let sites;
      let raw = "",
            magic,
            ic,
            staticBox;
      $: key = raw
            ? raw.split(":")[0].split(" ")[0].toLowerCase() in sites
                  ? raw.split(":")[0].split(" ")[0].toLowerCase()
                  : "g"
            : null;
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
                        staticBox.innerHTML += "<br>" + ans;
                  });
      };
      const go = (e) => {
            let term;
            if (raw == "") {
                  document.getElementById("autoComplete").innerHTML = "";
                  ic.src = `./icons/Basic.svg`;
            }
            switch (e.keyCode) {
                  case 40:
                        suggI = suggI == 4 || suggI == null ? 0 : suggI + 1;
                        magic.value = key + " " + suggList[suggI];
                        break;
                  case 38:
                        suggI = suggI == 0 || suggI == null ? 4 : suggI - 1;
                        magic.value = key + " " + suggList[suggI];
                        break;
                  default:
                        suggI = null;
                        break;
            }
            term = magic.value.replace(key + " ", "");
            if (term != "") sug(term);
            send = sites[key].prelink + term + sites[key].postlink;
            if (startsWith(raw, key + ":")) {
                  term = raw.replace(key + ":", "");
                  send = sites[key][term];
            }
            ic.src = `./icons/${sites[key].name}.svg`;
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
      const sug = (SIn) => {
            const sc_Old = document.getElementById("suggestions");
            if (sc_Old) sc_Old.remove();
            var sc = document.createElement("script");
            sc.src = `https://clients1.google.com/complete/search?client=youtube&hl=en&q=${SIn}&jsonp=returnSug`;
            sc.id = "suggestions";
            document.body.appendChild(sc);
      };

      onMount(() => {
            setTimeout(() => {
                  magic.focus();
            }, 500);
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
                        bind:value={raw}
                        size="100" />
            </div>
            <input type="submit" style="display:none" />
      </form>
      <div style="width:calc(100% - 1em);padding:0.5em;margin-top:0.5em;">
            <ul id="autoComplete" />
      </div>
      <div bind:this={staticBox} id="staticBox" />
</section>
