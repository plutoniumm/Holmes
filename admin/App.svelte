<script>
	import Corona from "./components/corona.svelte";
	import Projects from "./components/projects.svelte";
	import Reminders from "./components/reminders.svelte";
	import Terminal from "./components/terminal.svelte";
	import Space from "./components/space.svelte";
	import Reddit from "./components/reddit.svelte";
	import Shows from "./components/shows.svelte";
	import Gen from "./components/gen.svelte";
</script>

<style type="text/scss">
	.wrapper {
		width: 100%;
		display: grid;
		grid-gap: 10px;
		grid-template-columns: 1fr 1fr 1fr 1fr;
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

	.half {
		height: 49vh;
	}
	.full {
		height: 99vh;
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

	.a2 {
		grid-column: 1;
		grid-row: 4 / 6;
		background: transparent;
	}
	.b2 {
		position: relative;
		grid-column: 2 / 4;
		grid-row: 4;
		color: #fff;
		background: #223;
	}
	.c2 {
		grid-column: 4;
		grid-row: 4 / 6;
		background: transparent;
	}
	.d2 {
		grid-column: 2;
		grid-row: 5;
		background: transparent;
	}
	.e2 {
		grid-column: 3;
		grid-row: 5;
	}
</style>

<div class="wrapper">
	<div class="box a full">
		<Reddit />
	</div>
	<div class="box b half">
		<Projects />
		<!-- <Terminal /> -->
	</div>
	<div class="box c full">
		<Reminders />
	</div>
	<div class="box d half">
		<Gen />
	</div>
	<div class="box e half">
		<Space />
	</div>

	<div class="box a2 full">Hia</div>
	<div class="box b2 half">
		<Corona />
	</div>
	<div class="box c2 full">Hic</div>
	<div class="box d2 half">Hid</div>
	<div class="box e2 half">
		<Shows />
	</div>
</div>
