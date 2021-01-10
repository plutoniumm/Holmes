<script>
      fetch("http://localhost:4000/log")
            .then((res) => res.json())
            .then((r) => {
                  console.log(r.stats.filter((el) => el.total > 0));
            });
</script>

<style>
</style>
