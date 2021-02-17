<script>
	export let sites;

	import { wpp } from "./core/micro";

	let bg = wpp(),
		deets;

	window.onload = setTimeout(() => (deets.style.top = "5px"), 1000);
	import Search from "./components/search.svelte";
	import Alerts from "./components/alerts.svelte";
	import Links from "./components/links.svelte";
</script>

<div
	id="bgContainer"
	style="position: absolute;z-index: 0;width: 100%;height: 100vh;background:#000;"
>
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
			<g class={Math.round(Math.random()) ? "x" : "x-rev"}>
				<circle
					fill="url(#grad{Math.round(Math.random()) ? '1' : '2'})"
					cx={Math.floor(Math.random() * 200) + 300 + i}
					cy={Math.floor(Math.random() * 500) + 250 + i}
					r={Math.floor(Math.random() * 100) + 156 + i}
					style={`animation: ${
						Math.round(Math.random()) ? "bobY" : "bobY_rev"
					} ${
						Math.random() * 7 + 17
					}s infinite ease-in-out alternate;`}
				/>
			</g>
		{/each}
	</svg>
</div>

<section>
	<div bind:this={deets} id="deets">
		<div style="display:flex;">
			<img src="./icons/q.svg" alt="" />
			<div>Quartermaster</div>
		</div>
		<div>
			{new Date()
				.toLocaleDateString("en-GB", {
					weekday: "short",
					month: "short",
					day: "numeric",
					hour12: false,
					hour: "2-digit",
					minute: "2-digit",
				})
				.replace(",", "")}
		</div>
	</div>
	<Search {sites} />
	<Alerts />
	<Links />
</section>

<style type="text/scss">
	svg {
		width: 100%;
		height: 100%;
		circle {
			stroke: #fff;
		}
	}
	#deets {
		position: fixed;
		top: -20px;
		padding: 0 5px;
		display: flex;
		justify-content: space-between;
		width: calc(100% - 10px);
		transition: top 0.2s ease;
		img {
			width: 20px;
			height: 20px;
			margin: 0px 2px;
			filter: invert(100%);
		}
	}
	section {
		position: absolute;
		width: 100%;
		height: 100%;
		z-index: 1;
	}
	* {
		overflow-y: hidden;
	}
</style>
