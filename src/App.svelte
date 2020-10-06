<script>
	export let sites, days, links;

	import Navbar from "./components/navbar.svelte";
	import Days from "./components/days.svelte";
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
	<Links data={links} />
</main>
