<script>
    import Tzs from "./components/timezones.svelte";
    import Tasks from "./components/tasks.svelte";
    import Pomodoro from "./components/pomodoro.svelte";
    import Timer from "./components/timer.svelte";
    import Days from "./components/day.svelte";
    import { slide } from "svelte/transition";
    let chx = 0;
</script>

<section style="grid-template-rows: {chx ? '1fr' : '5fr 1fr'};">
    <div id="appleStyle">
        <input id="toggle" type="checkbox" bind:checked={chx} />
        <label id="control" for="toggle" />
        <div id="container" />
    </div>
    <div class="super blurW {chx ? 'zen' : ''}">
        &nbsp;
        {#if !chx}
            <div transition:slide>
                <Tzs />
            </div>
        {/if}
    </div>
    <div class="top blurW">
        {#if chx}
            <div in:slide>
                <Pomodoro />
            </div>
            <div in:slide>
                <Tasks />
            </div>
        {:else}
            <div in:slide>
                <Timer />
            </div>
        {/if}
    </div>
    <div class="low blurW {chx ? 'zen' : ''}">
        &nbsp;
        {#if !chx}
            <div transition:slide class="bottom">
                <Days />
            </div>
        {/if}
    </div>
</section>

<style type="text/scss">
    section {
        display: flex;
        flex-direction: column;
        height: 100vh;
        overflow-y: hidden;
    }
    .top,
    .low,
    .super {
        position: relative;
        width: calc(100% - 20px);
        margin: 10px;
        opacity: 1;
        height: auto;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .top {
        width: calc(100% - 40px);
        padding: 10px;
        flex: 5;
        div {
            width: 50%;
        }
    }
    .bottom {
        margin: 10px 20%;
        flex: 1;
        mask-image: linear-gradient(to right, #0000, #000, #0000);
        -webkit-mask-image: linear-gradient(to right, #0000, #000, #0000);
    }

    .zen {
        height: 1px;
        opacity: 0;
    }

    #appleStyle {
        position: fixed;
        right: 2%;
        top: 5%;
        z-index: 2;
        font-size: 10px;
        #toggle {
            display: none;
            &:checked ~ #container {
                background: #3d7;
                transition: 0.2s cubic-bezier(0.55, 0, 0.1, 1);
            }
            &:checked ~ #control {
                transform: translate(1.67em);
                transition: 0.2s cubic-bezier(0.55, 0, 0.1, 1);
            }
        }
        #control {
            background: white;
            border-radius: 2.5em;
            display: block;
            height: 2.125em;
            top: -0.045em;
            margin-left: 0.25em;
            position: relative;
            transition: 0.2s cubic-bezier(0.55, 0, 0.1, 1);
            width: 2.125em;
            z-index: 2;
        }
        #container {
            background: #ccc;
            border-radius: 2.5em;
            height: 2.5em;
            position: relative;
            transform: translateY(-2.375em);
            transition: 0.2s cubic-bezier(0.55, 0, 0.1, 1);
            width: 4.375em;
        }
    }
</style>
