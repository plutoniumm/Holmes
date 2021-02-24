<script>
	import Youtube from "./routes/youtube.svelte";
	import Browser from "./routes/system.svelte";
	import { URLpars } from "./core/api";
</script>

<main>
	{#if !URLpars().loc}
		<Youtube />
	{:else}
		<Browser />
	{/if}
</main>

<style>
	main,
	main * {
		overflow-x: hidden;
	}
</style>
