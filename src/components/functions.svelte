<script>
      import Timer from "../micro/timer.svelte";
      import Days from "../micro/days.svelte";

      const days = [
            { name: "D-Day", type: "since", date: "08/06/2019" },
            { name: "Lockdown", type: "till", date: "03/17/2020" },
      ];
</script>

<style>
</style>

<section style="display:flex;">
      <Timer />
      <Days {days} />
</section>
