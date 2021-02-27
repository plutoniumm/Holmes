<script>
	import Bar from "../components/bar.svelte";
	import Player from "../components/player.svelte";
	import Queue from "../components/queue.svelte";
	import Subsc from "../components/subscriptions.svelte";
	import Search from "../components/search.svelte";
	import Plist from "../components/playlists.svelte";

	import cnls from "../../config/channels.json";

	const size = 49;
	const chanList = new Array(Math.ceil(cnls.length / size));
	for (let i = 0; i < chanList.length; i++)
		chanList[i] = cnls.splice(0, size);

	import { vId } from "../core/store";

	import {
		search,
		plSearch,
		playlist,
		k,
		YT,
		URLpars,
		chURL,
	} from "../core/api";
	import { onMount } from "svelte";

	let [base, plStack] = [[], []];
	$: states = { plist: 0, loc: 0 };
	$: substack = [];

	const subsMon = (cList) => {
		const link = `${YT}channels?part=snippet%2CcontentDetails&id=${cList
			.map((el) => el.id)
			.join("%2C")}&key=${k}`;
		fetch(link)
			.then((res) => res.json())
			.then((r) => {
				r.items
					.map((el) => el.contentDetails.relatedPlaylists.uploads)
					.forEach((el) => {
						playlist(el + "&order=date", 4).then((r2) => {
							const arr = r2.items.filter(
								(r1) =>
									new Date() -
										new Date(r1.snippet.publishedAt) <=
									2 * 864e5
							);
							if (arr) substack = [...substack, ...arr];
						});
					});
			});
	};

	const channels = () => {
		substack = [];
		chanList.forEach(subsMon);
	};

	const searcher = (sc) => {
		const q = typeof sc == "string" ? sc : sc.target[0].value;
		search(q).then((r) => (base = r.items));
		window.location.href = "#search";
		chURL("q", q);
		if (states.plist) {
			plSearch(q).then((r) => (plStack = r.items));
		}
	};

	onMount(() => URLpars().q && searcher(URLpars().q));
</script>

<main>
	{#if !URLpars().zen}
		<Bar {searcher} {states} {channels} />
	{/if}
	{#if $vId}
		<Player />
	{:else}<br /> <br /> <br />{/if}
	{#if !URLpars().zen && !states.loc}
		<Queue />
		<Search videos={base} />
		<Subsc videos={substack} />
		<Plist videos={plStack} />
	{/if}
</main>

<style>
	main,
	main * {
		overflow-x: hidden;
	}
</style>
