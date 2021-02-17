<script>
    import APIs from "./components/apis.svelte";
    import ScriptEd from "./components/script.svelte";
</script>

<section>
    <div class="w-50">
        <APIs />
    </div>
    <div class="w-50">
        <ScriptEd />
    </div>
</section>

<style type="text/scss">
    section {
        display: flex;
    }
</style>
