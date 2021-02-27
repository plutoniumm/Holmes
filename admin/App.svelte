<script>
	import Nav from "./components/navigator.svelte";
	import Projects from "./components/projects.svelte";
	import Terminal from "./components/terminal.svelte";
	import Space from "./components/space.svelte";
	import Gen from "./components/gen.svelte";

	import admin from "../config/dash.json";

	let state = { main: "Projects", long: "Space" },
		Corona,
		Shows,
		Reminders;
	const naver = (e) => {
		const type = e.target.innerText;
		const loc = e.target.parentElement.title;
		console.log(type);
		if (type == "Corona" && !Corona)
			import("./lazy/corona.svelte").then((r) => (Corona = r.default));

		if (type == "Shows" && !Shows)
			import("./lazy/shows.svelte").then((r) => (Shows = r.default));

		if (type == "Reminders" && !Reminders)
			import("./lazy/reminders.svelte").then(
				(r) => (Reminders = r.default)
			);

		if (loc == "Central") state.main = type;
		if (loc == "LongBox") state.long = type;
	};
</script>

<div class="bg">
	<div class="wrapper blur w-100">
		<div
			class="boxy a full blur"
			style="margin:7px;height:calc(99vh - 15px)"
		>
			<Nav {naver} />
		</div>
		<div class="boxy b half">
			{#if state.main == "Projects"}
				<Projects projeccs={admin.projects} />
			{:else if state.main == "Corona"}
				<svelte:component this={Corona} />
			{/if}
		</div>
		<div class="boxy c full">
			{#if state.long == "Space"}
				<Space />
			{:else if state.long == "Shows"}
				<svelte:component this={Shows} />
			{:else if state.long == "Reminders"}
				<svelte:component this={Reminders} />
			{/if}
		</div>
		<div class="boxy d half">
			<Gen days={admin.days} />
		</div>
		<div class="boxy e half">
			<Terminal />
		</div>
	</div>
</div>

<style type="text/scss">
	.bg {
		background: url("/shared/bigSur.jpg") no-repeat center center;
		background-size: cover;
	}
	.wrapper {
		width: 100%;
		display: grid;
		grid-gap: 5px;
		grid-template-columns: 1fr 1fr 1fr 1fr;
		color: #444;
	}
	.boxy {
		color: #fff;
		border-radius: 10px;
		word-wrap: break-word;
		overflow-y: scroll;
		padding: 2px;
	}
	.half {
		height: calc(49vh - 10px);
	}
	.full {
		height: calc(99vh - 10px);
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
</style>
