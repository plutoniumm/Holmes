<script>
    import APIs from "./components/apis.svelte";
</script>

<section>
    <div class="splitter">
        <APIs />
    </div>
    <div class="splitter">
        <APIs />
    </div>
</section>

<style type="text/scss">
    section {
        display: flex;
        .splitter {
            width: 100%;
        }
    }
</style>
