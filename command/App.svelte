<script>
	import TopBar from "./micro/topbar.svelte";

	import Search from "./components/search.svelte";
	import Alerts from "./components/alerts.svelte";

	import News from "./lazy/news.svelte";

	const state = { news: 0 };

	window.onscroll = () => {
		if (window.scrollY > 10) state.news = 1;
	};
</script>

<div id="bgContainer">
	<img src="./shared/bigSur.jpg" class="w-100" alt="" />
</div>

<section class="w-100">
	<TopBar />
	<Search />
	<Alerts />
	<div id="Qlinks">
		Scroll for Today <br />
		<svg
			viewBox="0 0 32 32"
			width="25"
			height="25"
			fill="none"
			stroke="currentcolor"
			stroke-width="1"
		>
			<path d="M30 12 L16 24 2 12" />
		</svg>
	</div>
</section>

<section style="padding:0 25%;height:auto;">
	<div id="newsBox" class="w-100" style="margin:0 auto;margin-top:20%;">
		{#if state.news}
			<News />
		{/if}
	</div>
</section>

<svelte:head>
	<style>
		*::-webkit-scrollbar {
			display: none;
		}
	</style>
</svelte:head>

<style type="text/scss">
	#bgContainer {
		position: fixed;
		z-index: 0;
		width: 100vw;
		height: 100vh;
		background: #000;
		img {
			height: 100%;
			object-fit: cover;
		}
	}
	#Qlinks {
		width: calc(100% - 10px);
		text-align: center;
		animation: downBar 0.2s ease forwards;
		animation-delay: 1s;
		position: absolute;
		bottom: -5em;
	}
	@keyframes downBar {
		to {
			bottom: 0.5em;
		}
	}
	section {
		position: relative;
		height: 100vh;
		z-index: 1;
	}
</style>
