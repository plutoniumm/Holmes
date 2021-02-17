<script>
    let [data] = [""];

    const execScr = () => {
        console.log(data);
    };
</script>

<section class="blur boxes">
    <h3 class="w-100">Script Editor</h3>
    <form class="w-100" on:submit|preventDefault={execScr}>
        <textarea
            name="data"
            class="w-100"
            placeholder="Enter Data..."
            bind:value={data}
        />
    </form>
    <p class="w-100">{"ok"}</p>
</section>

<style>
    .boxes {
        width: 95%;
        flex-wrap: wrap;
        max-height: 95vh;
        overflow-y: scroll;
    }
    textarea {
        color: #fff;
        transition: height 0.2s ease;
    }
</style>
