<script>
	import Browser from "../local/browser.svelte";

	import { type } from "../core/local";
</script>

<main>
	<Browser />
	{#if $type == "image"}
		Image
	{:else if $type == "video"}
		video
	{/if}
</main>

<style>
	main,
	main * {
		overflow-x: hidden;
	}
</style>
