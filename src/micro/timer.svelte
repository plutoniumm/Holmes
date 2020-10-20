<script>
      let timeIn, clock, progressbar, str;

      $: stopped = true;
      $: pause = false;
      $: d = timeIn * 60;

      const stopper = () => {
            d = 1;
            clock.innerText = "0h 0m 0s";
            stopped = true;
      };
      const pauser = () => {
            pause = true;
      };
      const timer = () => {
            pause = false;
            if (stopped) {
                  d = timeIn * 60;
                  str = d;
                  stopped = false;
            }
            var x = setInterval(() => {
                  d--;
                  var h = Math.floor((d % (3600 * 24 * 365.25)) / 3600);
                  var m = Math.floor((d % 3600) / 60);
                  var s = Math.floor(d % 60);
                  var pers = Math.round((d / str) * 100);
                  clock.innerText = `${h}h ${m}m ${s}s`;

                  progressbar.style.width = pers + "%";
                  if (pers > 50) {
                        progressbar.style.background = `rgb(${
                              255 * (2 - pers / 50)
                        },255,0)`;
                  } else {
                        progressbar.style.background = `rgb(255,${
                              (255 * pers) / 50
                        },0)`;
                  }
                  if (d <= 0 || pause) {
                        clearInterval(x);
                        progressbar.style.width = "100%";
                        if (pause) progressbar.style.background = "#f80";
                        else progressbar.style.background = "green";
                  }
            }, 1000);
      };
</script>

<style type="text/scss">
      .dynaBox {
            display: flex;
            justify-content: center;
            padding: 0;
            flex-wrap: wrap;
            height: 114px;
            input,
            button {
                  border: 0;
                  width: 125px;
                  margin: 0;
                  font-size: 1em;
                  height: 100%;
                  outline: none;
                  color: white;
                  &:hover {
                        cursor: pointer;
                        box-shadow: 0 0 5px 2px #fff8;
                        transition: box-shadow 0.3s ease;
                  }
            }
            input[type="number"] {
                  padding-left: 15px;
                  width: 108px;
                  background: #0af;
                  &::-webkit-outer-spin-button,
                  &::-webkit-inner-spin-button {
                        -webkit-appearance: none;
                        margin: 0;
                  }
                  &::placeholder {
                        color: #ddd;
                  }
            }
            button {
                  text-transform: uppercase;
            }
      }
      .counter {
            position: relative;
            font-size: 2.5em;
            padding: 7px 0;
            height: 100px;
            z-index: 2;
            text-align: center;
            line-height: 0.5em;
      }
      .pbar {
            border-radius: 0.25em;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: transparent;
            z-index: -1;
            height: 100%;
            transition: width 0.3s ease;
      }
</style>

<div style="display:flex;position:relative;">
      <div class="dynaBox box">
            <form
                  on:submit|preventDefault={timer}
                  style="display:flex;padding:0;margin:0;width:250px;">
                  <input
                        placeholder="Enter Mins"
                        type="number"
                        required
                        disabled={!stopped}
                        bind:value={timeIn} />
                  <input
                        type="submit"
                        value="GO"
                        style="background:#0c0;color:white;" />
            </form>
            <div style="display:flex;">
                  <button
                        on:click={pauser}
                        style="background:#f80;color:white;">Pause</button>
                  <button
                        on:click={stopper}
                        style="background:#f00;color:white;">Stop</button>
            </div>
      </div>
      <div class="dynaBox counter box">
            <div bind:this={progressbar} class="pbar" />
            <p bind:this={clock}>0h 0m 0s</p>
            {#if pause}
                  <p
                        style="font-size:0.5em;color:#000;background:yellow;border-radius:2em;width:40%;margin: 0 auto;">
                        PAUSED
                  </p>
            {/if}
      </div>
</div>
