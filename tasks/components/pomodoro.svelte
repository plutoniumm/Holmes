<script>
    import { timeCal, strCal, play } from "./functions.js";
    const [pom, brk] = ["00:25:00", "00:05:00"];
    let [clock, time] = [null, pom];
    let indic,
        state = { run: 0 };

    const later = (delay) => {
        function reset() {
            state.run = 0;
            indic.style.height = 100 + "%";
            clearInterval(interval);
            time = pom;
        }

        const to = new Date().getTime() + delay * 1e3;
        let reject = null,
            interval;

        const promise = new Promise((resolve, _reject) => {
            reject = _reject;
            state.run = 1;
            let temp = delay;
            interval = setInterval(() => {
                const left = new Date().getTime();
                temp = (to - left) / 1e3;
                time = strCal(temp);
                indic.style.height =
                    (temp > 1 ? (temp * 100) / delay : 100) + "%";
                document.title = time;
                if (temp < 1) {
                    resolve();
                    play();
                    reset();
                }
            }, 1e3);
        });
        return {
            get promise() {
                return promise;
            },
            cancel() {
                if (interval) {
                    reset();
                    reject();
                    reject = null;
                }
            },
        };
    };

    const pomorun = () => {
        indic.parentElement.style.color = "#800";
        clock = later(timeCal(pom));
        clock.promise
            .then(() => {
                indic.parentElement.style.color = "#080";
                clock = later(timeCal(brk));
            })
            .catch(() => {
                console.error("l2 cancelled");
            });
    };

    const detector = (e) => {
        play();
        if ((e.keyCode === 13 || e.type == "click") && !state.run) pomorun();
    };

    const otherFuncs = (e) => {
        if (e.target.innerText == "Reset") clock.cancel();
    };
</script>

<section class="flex-col">
    <article>
        <div class="times w-100">
            <span id="timeBox" on:keyup|preventDefault={detector}>{time}s</span>
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
        align-items: center;
        justify-content: center;
    }
    article {
        background: #000;
        color: #f00;
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
            background: #fff;
            z-index: 0;
            transition: height 1s linear;
            position: absolute;
            bottom: 0;
            height: 100%;
        }
    }
    #timeBox {
        &:focus {
            outline: none;
        }
    }
</style>
