<script>
    import System from "./components/system.svelte";
    import APIs from "./components/apis.svelte";
    import ScriptEd from "./components/script.svelte";
</script>

<section class="flex">
    <div class="w-50">
        <APIs />
    </div>
    <div class="w-50">
        <System />
    </div>
    <div class="w-50">
        <ScriptEd />
    </div>
</section>

<style type="text/scss">
    section {
        flex-wrap: wrap;
    }
</style>
