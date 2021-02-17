<script>
    import { timeCal, strCal } from "./functions.js";
    let [clock, time] = [null, "00:00:00"];
    let indic,
        state = { run: 1 };

    const later = (delay) => {
        let [timer, reject] = [0, null],
            interval;
        const promise = new Promise((resolve, _reject) => {
            reject = _reject;
            state.run = 1;
            let temp = delay;
            timer = setTimeout(() => {
                resolve;
                state.run = 0;
            }, delay * 1e3);
            interval = setInterval(() => {
                temp--;
                time = temp > 1 ? strCal(temp) : "00:00:00";
                indic.style.height =
                    (temp > 1 ? (temp * 100) / delay : 100) + "%";
                if (!state.run) {
                    clearInterval(interval);
                    time = "00:00:00";
                    indic.style.height = 100 + "%";
                }
            }, 1e3);
        });
        return {
            get promise() {
                return promise;
            },
            cancel() {
                if (timer) {
                    clearTimeout(timer);
                    timer = 0;
                    state.run = 0;
                    reject();
                    reject = null;
                }
            },
        };
    };

    clock = later(10);
    clock.promise
        .then(() => {
            console.log("done");
        })
        .catch(() => {
            time = "00:00:00";
            console.log("l2 cancelled");
        });
    // setTimeout(() => {
    //     clock.cancel();
    // }, 15);

    const detector = (e) => {
        if (+e.keyCode - 48 > -1 && +e.keyCode - 48 < 10 && !state.run) {
            let vars = time.split("");
            time = [
                vars[1],
                vars[3],
                ":",
                vars[4],
                vars[6],
                ":",
                vars[7],
                e.keyCode - 48,
            ].join("");
        }
        if (+e.keyCode == 8) {
            let vars = time.split("");
            time = [
                0,
                vars[0],
                ":",
                vars[1],
                vars[3],
                ":",
                vars[4],
                vars[6],
            ].join("");
        }

        if (e.keyCode === 13 || e.type == "click") {
            const till = timeCal(time);
            clock = later(time);
        }
    };

    const otherFuncs = (e) => {
        if (e.target.innerText == "Reset") clock.cancel();
    };
</script>

<section>
    <article>
        <div class="times w-100">
            <span
                id="timeBox"
                on:keyup|preventDefault={detector}
                bind:innerHTML={time}
                contenteditable=""
            />s
            <div
                on:click={detector}
                style="font-size:0.66em;font-weight:600;cursor:pointer;"
            >
                <br />
                Start
            </div>
        </div>
        <div bind:this={indic} class="indic w-100">&nbsp;</div>
    </article>
    <div
        on:click={otherFuncs}
        style="font-size:0.66em;font-weight:600;cursor:pointer;"
    >
        Reset
    </div>
</section>

<style type="text/scss">
    section {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    article {
        background: #d88;
        border-radius: 10em;
        width: 10em;
        height: 10em;
        overflow: hidden;
        border: 5px solid #fff;
        position: relative;
        .times {
            position: absolute;
            top: 2.8em;
            z-index: 1;
            font-size: 1.5em;
            left: 0.05em;
            text-align: center;
        }
        .indic {
            background: #e66a;
            z-index: 0;
            transition: height 1s linear;
            position: absolute;
            bottom: 0;
            height: 50%;
        }
    }
    #timeBox {
        &:focus {
            outline: none;
        }
    }
</style>
