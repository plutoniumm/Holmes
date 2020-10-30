<script>
	export let sites;

	import { wpp } from "./core/micro";

	let bg = wpp();
	$: showStats = !true;
	import Navbar from "./components/navbar.svelte";
	import Search from "./components/search.svelte";
	import Functions from "./components/functions.svelte";
	import Notifs from "./components/notifs.svelte";
	import Stats from "./components/stats.svelte";
	import Links from "./components/links.svelte";
</script>

<style type="text/scss">
	svg {
		position: absolute;
		z-index: 0;
		width: 100%;
		height: 100vh;
		circle {
			stroke: #fff;
		}
	}
	section {
		position: absolute;
		width: 100%;
		height: 100%;
		z-index: 1;
	}
</style>

<svg viewbox="0 0 1024 1024" style="background:{bg.bg}">
	<defs>
		<linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
			<stop offset="0%" style="stop-color:{bg.g1}" />
			<stop offset="100%" style="stop-color:{bg.g2}" />
		</linearGradient>
		<linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
			<stop offset="0%" style="stop-color:{bg.g2}" />
			<stop offset="100%" style="stop-color:{bg.g1}" />
		</linearGradient>
	</defs>
	{#each Array(Math.round(Math.random() * 3 + 3)) as _, i}
		<g class={Math.round(Math.random()) ? 'x' : 'x-rev'}>
			<circle
				fill="url(#grad{Math.round(Math.random()) ? '1' : '2'})"
				cx={Math.floor(Math.random() * 200) + 300 + i}
				cy={Math.floor(Math.random() * 500) + 250 + i}
				r={Math.floor(Math.random() * 100) + 156 + i}
				style={`animation: ${Math.round(Math.random()) ? 'bobY' : 'bobY_rev'} ${Math.random() * 7 + 7}s infinite ease-in-out alternate;`} />
		</g>
	{/each}
</svg>

<section>
	<Navbar />
	<Search {sites} />
	<div style="padding:0 10%;">
		<Functions />
		<Notifs />
		{#if showStats}
			<Stats />
		{/if}
	</div>
	<Links />
</section>
