<script>
	import Search from "./components/search.svelte";
	import Alerts from "./components/alerts.svelte";
	import Links from "./components/links.svelte";

	let date = "";
	setInterval(
		() =>
			(date = new Date().toLocaleDateString("en-GB", {
				weekday: "short",
				month: "short",
				day: "numeric",
				hour12: false,
				hour: "2-digit",
				minute: "2-digit",
			})),
		1e3
	);
</script>

<div
	id="bgContainer"
	style="position: absolute;z-index: 0;width: 100vw;height: 100vh;background:#000;"
>
	<img src="./shared/bigSur.jpg" class="w-100" height="100%" alt="" />
</div>

<section class="w-100">
	<div class="flex" id="deets">
		<svg viewbox="0 0 256 128" height="22px">
			<defs>
				<linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
					<stop offset="0%" style="stop-color:#000;" />
					<stop offset="100%" style="stop-color:#900;" />
				</linearGradient>
			</defs>
			<text
				fill="url(#grad1)"
				font-weight="700"
				font-family="Times"
				font-size="128"
				x="0"
				y="110">浪人</text
			>
		</svg>
		<div>{date}</div>
	</div>
	<Search />
	<Alerts />
	<div id="Qlinks">
		<Links />
	</div>
</section>

<style type="text/scss">
	#deets {
		position: fixed;
		top: -20px;
		padding: 0 5px;
		justify-content: space-between;
		width: calc(100% - 10px);
		animation: topBar 0.2s ease forwards;
		animation-delay: 1s;
	}
	#Qlinks {
		position: fixed;
		bottom: -10em;
		width: calc(100% - 10px);
		animation: linksBar 0.2s ease forwards;
		animation-delay: 1s;
	}
	@keyframes topBar {
		to {
			top: 5px;
		}
	}
	@keyframes linksBar {
		to {
			bottom: 0.25em;
		}
	}
	section {
		position: absolute;
		height: 100%;
		z-index: 1;
	}
	* {
		overflow-y: hidden;
	}
</style>
