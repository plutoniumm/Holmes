<script>
    let [link, method, data] = [
        "https://jsonplaceholder.typicode.com/posts",
        "GET",
        "",
    ];

    let resp = "";
    const makeCall = () => requester().then((r) => (resp = r));
    const requester = async () => {
        const response = await fetch(link, {
            method: method,
            mode: "cors",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
            },
            referrerPolicy: "no-referrer",
            ...(method == "POST" && { body: JSON.stringify(data) }),
        });
        return response.json();
    };
</script>

<section class="blur boxes">
    <h3 class="w-100">APIs</h3>
    <form on:submit|preventDefault={makeCall}>
        <input
            class="w-100"
            placeholder="Enter Link..."
            type="text"
            bind:value={link}
        />
        Method:
        <select bind:value={method}>
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
            rows="10"
            style="height:{method == 'POST' ? '100px' : '0'}"
            bind:value={data}
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
