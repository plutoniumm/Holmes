<script>
	export let sites, days, links;

	import Navbar from "./components/navbar.svelte";
	import Sidebar from "./components/sidebar.svelte";
	import Search from "./components/search.svelte";
	import Links from "./components/links.svelte";

	console.log(days);
	console.log(links);
</script>

<style>
	/* main {
		display: flex;
	} */
</style>

<main>
	<Navbar />
	<Sidebar />
	<Search {sites} />
	<Links data={links} />
</main>
