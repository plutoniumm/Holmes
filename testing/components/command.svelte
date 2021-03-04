<script>
    import { onMount } from "svelte";

    import { preprocessor, engine } from "../../public/shared/js/samurai";
    import { validity } from "./functions";

    const preprocessorTests = [
        validity(
            preprocessor,
            { key: "r", query: "/test1", url: "Test Failed" },
            "https://www.reddit.com/r/test1"
        ),
        validity(
            preprocessor,
            {
                key: "r",
                query: "test2",
                url: "https://www.reddit.com/search?q=test2",
            },
            "https://www.reddit.com/search?q=test2"
        ),
        validity(
            preprocessor,
            {
                key: "git",
                query: "svelte",
                url: "https://github.com/search?&q=svelte",
            },
            "https://github.com/search?&q=svelte"
        ),
    ];

    const engineTests = [
        validity(
            engine,
            "!git:me",
            "https://github.com/plutoniumm?tab=repositories",
            "url"
        ),
        validity(
            engine,
            "!git svelte",
            "https://github.com/search?&q=svelte",
            "url"
        ),
    ];

    const allTests = [...preprocessorTests, ...engineTests];

    onMount(() => {
        setTimeout(() => {
            console.clear();
        }, 1000);
    });
</script>

<article>
    <div class="pass">{allTests.filter((x) => x === 0).length} PASSED!</div>
    <div class="fail">{allTests.filter((x) => x !== 0).length} FAILED!</div>
</article>

<style>
    .pass,
    .fail {
        padding: 10px;
    }
    .pass {
        color: #0f0;
    }
    .fail {
        color: #f00;
    }
</style>
