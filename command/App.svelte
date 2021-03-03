<script>
	import Search from "./components/search.svelte";
	import Alerts from "./components/alerts.svelte";
	import Links from "./components/links.svelte";
</script>

<div
	id="bgContainer"
	style="position: absolute;z-index: 0;width: 100vw;height: 100vh;background:#000;"
>
	<img src="./shared/bigSur.jpg" class="w-100" height="100%" alt="" />
</div>

<section class="w-100">
	<div class="flex" id="deets">
		<div class="flex">
			<img src="./icons/q.svg" alt="" />
			<div>Ronin</div>
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
	<Search />
	<Alerts />
	<Links />
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
		img {
			width: 20px;
			height: 20px;
			margin: 0px 2px;
			filter: invert(100%);
		}
	}
	@keyframes topBar {
		from {
			top: -20px;
		}
		to {
			top: 5px;
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
