<script>
    import Google from "./components/gtrends.svelte";

    let src = "Political";
    const chNews = (e) => {
        src = e.target.innerText;
    };
</script>

<section>
    <nav class="rpm-10 flex blur" on:click={chNews}>
        <div class="ln {src === 'Political' ? 'blurW' : 'blur'}">Political</div>
        <div class="ln {src === 'Software' ? 'blurW' : 'blur'}">Software</div>
    </nav>
    <Google />
</section>

<style type="text/scss">
    nav {
        justify-content: space-around;
        .ln {
            padding: 5px 10px;
            border-radius: 5px;
            transform: scale(1);
            cursor: pointer;
            &:hover {
                transform: scale(1.01);
            }
        }
    }
</style>
