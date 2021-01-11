<script>
	import Corona from "./components/corona.svelte";
	import Space from "./components/space.svelte";
	import Reddit from "./components/reddit.svelte";
	import Shows from "./components/shows.svelte";
	import Gen from "./components/gen.svelte";
</script>

<style>
	.wrapper {
		width: 100%;
		display: grid;
		grid-gap: 10px;
		grid-template-columns: 1fr 1fr 1fr 1fr;
		height: 99vh;
		color: #444;
	}

	.box {
		background-color: #333;
		color: #fff;
		border-radius: 5px;
		word-wrap: break-word;
		overflow-y: scroll;
		padding: 5px;
	}

	.a {
		grid-column: 1;
		grid-row: 1 / 3;
	}
	.b {
		grid-column: 2 / 4;
		grid-row: 1;
	}
	.c {
		grid-column: 4;
		grid-row: 1 / 3;
	}
	.d {
		grid-column: 2;
		grid-row: 2;
	}
	.e {
		grid-column: 3;
		grid-row: 2;
	}
</style>

<div class="wrapper">
	<div class="box a">
		<Reddit />
	</div>
	<div class="box b">
		<Corona />
	</div>
	<div class="box c">
		<Space />
	</div>
	<div class="box d">
		<Gen />
	</div>
	<div class="box e">
		<Shows />
	</div>
</div>

<!-- http://api.tvmaze.com/singlesearch/shows?q=kakegurui -->
