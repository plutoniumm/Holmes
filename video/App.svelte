<script>
	import Bar from "./components/bar.svelte";
	import Player from "./components/player.svelte";
	import Stack from "./components/stackstream.svelte";
	import Subsc from "./components/substream.svelte";
	import Stream from "./components/videostream.svelte";
	import Plist from "./components/playlists.svelte";

	import cnls from "../config/channels.json";

	const size = 49;
	const chanList = new Array(Math.ceil(cnls.length / size));
	for (let i = 0; i < chanList.length; i++)
		chanList[i] = cnls.splice(0, size);

	import {
		search,
		plSearch,
		playlist,
		k,
		YT,
		URLpars,
		chURL,
	} from "./core/api";

	let base = [],
		plStack = [],
		states = { plist: 0 },
		id = URLpars().id || "";
	$: stack = JSON.parse(localStorage.getItem(URLpars().stack)) || [];
	$: substack = [];

	const channels = () => {
		substack = [];
		console.log(chanList);
		chanList.forEach((e) => subsMon(e));
	};
	const subsMon = (cList) => {
		fetch(
			`${YT}channels?part=snippet%2CcontentDetails&id=${cList
				.map((el) => el.id)
				.join("%2C")}&key=${k}`
		)
			.then((res) => res.json())
			.then((r) => {
				r.items
					.map((el) => el.contentDetails.relatedPlaylists.uploads)
					.forEach((el) => {
						playlist(el + "&order=date", 3)
							.then((r2) =>
								r2.items.filter(
									(r1) =>
										Math.abs(
											new Date(r1.snippet.publishedAt) -
												new Date()
										) <=
										2 * 864e5
								)
							)
							.then((r3) => {
								if (r3) substack = [...substack, ...r3];
							});
					});
			});
	};

	const searcher = (sc) => {
		const q = sc || document.getElementById("srcBox").value;
		search(q).then((r) => (base = r.items));
		window.location.href = "#search";
		chURL("q", q);
		if (states.plist) {
			plSearch(q).then((r) => (plStack = r.items));
		}
	};
	const vidoer = (e) => {
		id = e.target.parentElement.id;
		chURL("id", id);
		window.location.href = "#main";
		document.title = e.target.parentElement.getAttribute("data-title");
	};
	const fullStacker = (vids) => (stack = [...stack, ...vids]);
	const stacker = (vid) => (stack = [...stack, vid]);
	const destacker = (i) => {
		stack.splice(i, 1);
		stack = stack;
		const trk = new Date().getTime();
		localStorage.removeItem(URLpars().stack);
		if (stack.length > 0) {
			localStorage.setItem(trk, JSON.stringify(stack));
			chURL("stack", trk);
		} else chURL("stack", "");
	};
	window.onload = URLpars().q ? searcher(URLpars().q) : null;
</script>

<main>
	<Bar {searcher} {states} {channels} {substack} />
	{#if id}
		<Player {id} />
	{:else}<br /> <br /> <br />{/if}
	<Stack videos={stack} {vidoer} {destacker} />
	<Stream videos={base} {vidoer} {stacker} />
	<Subsc videos={substack} {vidoer} {stacker} />
	<Plist videos={plStack} {fullStacker} />
</main>

<style>
	main,
	main * {
		overflow-x: hidden;
	}
</style>
