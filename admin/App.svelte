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
		grid-gap: 5px;
		grid-template-columns: 1fr 1fr 1fr 1fr;
		color: #444;
	}
	.box {
		background-color: #222;
		color: #fff;
		border-radius: 5px;
		word-wrap: break-word;
		overflow-y: scroll;
		padding: 2px;
	}
	.half {
		height: 49vh;
	}
	.full {
		height: 99vh;
	}
	.plain {
		background: transparent;
	}
	.a {
		grid-column: 1;
		grid-row: 1 / 3;
	}
	.b {
		position: relative;
		grid-column: 2 / 4;
		grid-row: 1;
		color: #fff;
		padding: 0;
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
	.a2 {
		grid-column: 1;
		grid-row: 4 / 6;
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
	}
	.d2 {
		grid-column: 2;
		grid-row: 5;
	}
	.e2 {
		grid-column: 3;
		grid-row: 5;
	}
</style>

<div class="wrapper">
	<div class="box a full plain">
		<Reddit />
	</div>
	<div class="box b half plain">
		<Projects />
	</div>
	<div class="box c full">
		<Space />
	</div>
	<div class="box d half plain">
		<Terminal />
		<Gen />
	</div>
	<div class="box e half plain">
		<Reminders />
	</div>

	<div class="box a2 full plain">Hia</div>
	<div class="box b2 half">
		<Corona />
	</div>
	<div class="box c2 full plain">Hic</div>
	<div class="box d2 half plain">Hid</div>
	<div class="box e2 half">
		<Shows />
	</div>
</div>
