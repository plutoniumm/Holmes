<script>
    let form,
        resp = "";

    const makeCall = () => requester().then((r) => (resp = r));

    const requester = async () => {
        let formDat = new FormData(form);
        const response = await fetch(formDat.get("link"), {
            method: formDat.method,
            mode: "cors",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
            },
            referrerPolicy: "no-referrer",
            ...(formDat.method === "POST" && {
                body: JSON.stringify(formDat.data)
            })
        });
        return response.json();
    };
</script>

<section class="blur boxes">
    <h3 class="w-100">APIs</h3>
    <form on:submit|preventDefault={makeCall} bind:this={form}>
        <input
            name="link"
            class="w-100"
            placeholder="Enter Link..."
            type="text"
            value="https://jsonplaceholder.typicode.com/posts"
        />
        Method:
        <select>
            {#each ["GET", "POST", "PUT", "DELETE"] as mt}
                <option value={mt}>
                    {mt}
                </option>
            {/each}
        </select>
        <textarea
            name="data"
            class="w-100"
            placeholder="Enter Data..."
            rows="3"
            value="&lcub;&#13; &#9; &#13;&rcub;"
        />
    </form>
    <pre
        class="w-100">
        <code id="json">
            {@html JSON.stringify(resp, undefined, 2)}
        </code>
    </pre>
</section>

<style>
    .boxes {
        width: 95%;
        flex-wrap: wrap;
        max-height: 95vh;
        overflow-y: scroll;
    }
    input,
    textarea {
        color: #fff;
    }
    textarea {
        transition: height 0.2s ease;
    }
    pre {
        font-weight: 300;
        overflow-x: auto;
        white-space: pre-wrap;
        white-space: -moz-pre-wrap;
        white-space: -pre-wrap;
        white-space: -o-pre-wrap;
        word-wrap: break-word;
    }
</style>
