<script>
    import Tasks from "./components/tasks.svelte";
    import Timer from "./components/timer.svelte";
    import Days from "./components/day.svelte";
    import { onMount } from "svelte";

    onMount(() =>
        document
            .getElementById("timeBox")
            .addEventListener("keydown", (e) => e.preventDefault())
    );
</script>

<section>
    <div class="top blurW">
        <div>
            <Timer />
        </div>
        <div>
            <Tasks />
        </div>
    </div>
    <div class="low blurW">
        <div class="bottom">
            <Days />
        </div>
    </div>
</section>

<style type="text/scss">
    section {
        display: grid;
        grid-template-rows: 5fr 1fr;
        height: 100vh;
    }
    .top,
    .low {
        width: calc(100% - 40px);
        margin: 10px;
        padding: 10px;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .top {
        grid-row: 1;
        div {
            width: 50%;
        }
    }
    .bottom {
        grid-row: 2;
        -webkit-mask-image: linear-gradient(to right, #0000, #000, #0000);
    }
</style>
