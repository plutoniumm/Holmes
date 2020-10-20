<script>
	export let sites;

	$: showStats = !true;
	import Navbar from "./components/navbar.svelte";
	import Search from "./components/search.svelte";
	import Functions from "./components/functions.svelte";
	import Notifs from "./components/notifs.svelte";
	import Stats from "./components/stats.svelte";
	import Links from "./components/links.svelte";
</script>

<style>
	section {
		width: calc(85% - 2em);
		padding: 0 1em;
		margin: 0 auto;
	}
</style>

<main>
	<Navbar />
	<Search {sites} />
	<section>
		<Functions />
		<Notifs />
	</section>
	{#if showStats}
		<section>
			<Stats />
		</section>
	{/if}
	<Links />
</main>
