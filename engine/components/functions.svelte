<script>
      import Timer from "../micro/timer.svelte";
      import Days from "../micro/days.svelte";

      const days = [
            { name: "D-Day", type: "since", date: "07/26/2019" },
            { name: "Lockdown", type: "since", date: "03/17/2020" },
      ];
</script>

<style>
</style>

<section style="display:flex;overflow-x:scroll;">
      <Timer />
      <Days {days} />
</section>
