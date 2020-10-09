<script>
	export let sites, days;

	import Navbar from "./components/navbar.svelte";
	import Search from "./components/search.svelte";
	import Functions from "./components/functions.svelte";
	import Days from "./components/days.svelte";
	import Notifs from "./components/notifs.svelte";
	import Links from "./components/links.svelte";
</script>

<style>
	/* main {
		display: flex;
	} */
</style>

<main>
	<Navbar />
	<Search {sites} />
	<section style="width: calc(85% - 2em);padding: 0 1em;margin: 0 auto;">
		<Functions />
		<Days {days} />
		<Notifs />
	</section>
	<Links />
</main>
