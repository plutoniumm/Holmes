<script>
      export let data;

      console.log(data);
</script>

<style>
</style>

<section>
      {#each data as link}{link.name}{/each}
</section>
