<script>
	import Corona from "./components/corona.svelte";
	import Terminal from "./components/terminal.svelte";
	import Space from "./components/space.svelte";
	import Reddit from "./components/reddit.svelte";
	import Shows from "./components/shows.svelte";
	import Gen from "./components/gen.svelte";

	let states = {
		main: 1,
	};

	const chMain = () => (states.main = !states.main);
</script>

<style type="text/scss">
	.wrapper {
		width: 100%;
		display: grid;
		grid-gap: 10px;
		grid-template-columns: 1fr 1fr 1fr 1fr;
		height: 99vh;
		color: #444;
	}

	.box {
		background-color: #222;
		color: #fff;
		border-radius: 5px;
		word-wrap: break-word;
		overflow-y: scroll;
		padding: 5px;
	}

	.a {
		grid-column: 1;
		grid-row: 1 / 3;
		background: transparent;
	}
	.b {
		position: relative;
		grid-column: 2 / 4;
		grid-row: 1;
		color: #fff;
		/* background: radial-gradient(ellipse at 20% 80%, #f88, transparent),
		radial-gradient(ellipse at 70% 10%, #88f, transparent); */
		background: #223;
	}
	.c {
		grid-column: 4;
		grid-row: 1 / 3;
		background: transparent;
	}
	.d {
		grid-column: 2;
		grid-row: 2;
		background: transparent;
	}
	.e {
		grid-column: 3;
		grid-row: 2;
	}

	.mainController {
		position: absolute;
		bottom: 5px;
		left: 42%;
		cursor: pointer;
		width: 150px;
		justify-content: center;
		padding: 5px 2px;
		border-radius: 25px;
		display: flex;
		background: #222;
		.states {
			padding: 7px;
		}
		.active {
			background: #334;
			border-radius: 5px;
		}
	}
</style>

<div class="wrapper">
	<div class="box a">
		<Reddit />
	</div>
	<div class="box b">
		{#if !states.main}
			<Corona />
		{:else}
			<Terminal />
		{/if}
		<div class="mainController">
			<div
				on:click={chMain}
				class="states {!states.main ? 'active' : ''}">
				STATS
			</div>
			<div
				on:click={chMain}
				class="states {!states.main ? '' : 'active'}">
				SYSTEM
			</div>
		</div>
	</div>
	<!-- <div class="box c">
		<Space />
	</div> -->
	<div class="box d">
		<Gen />
	</div>
	<!-- <div class="box e">
		<Shows />
	</div> -->
</div>

<!-- http://api.tvmaze.com/singlesearch/shows?q=kakegurui -->
