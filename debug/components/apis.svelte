<script>
    let link = "https://jsonplaceholder.typicode.com/todos/1";

    reqester = async (data = {}) => {
        const response = await fetch(link, {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
            },
            referrerPolicy: "no-referrer",
            body: JSON.stringify(data),
        });
        return response.json();
    };

    postData("https://example.com/answer", { answer: 42 }).then((data) => {
        console.log(data); // JSON data parsed by `data.json()` call
    });
</script>

<section class="blur boxes">
    <h3 class="w-100">APIs</h3>
    <input class="w-100" type="text" bind:value={link} />
</section>

<style>
    .boxes {
        width: 95%;
        flex-wrap: wrap;
    }
    input {
        color: #fff;
    }
</style>
