<script>
	export let sites, days, links;

	import Navbar from "./components/navbar.svelte";
	import Days from "./components/days.svelte";
	import Notifs from "./components/notifs.svelte";
	import Search from "./components/search.svelte";
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
	<Days {days} />
	<Notifs />
	<Links data={links} />
</main>
