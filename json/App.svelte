<script>
    let mlt = [];

     fetch("/Data/multiple.json")
        .then((res) => res.json())
        .then((r) => (mlt = r));

    import Multi from "./components/multiple.svelte";
</script>

<style>
</style>

<section>
    <Multi set={mlt}/>
</section>
