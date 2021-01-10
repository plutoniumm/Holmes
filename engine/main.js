import App from './App.svelte';
import sites from './data/sites.json'

const app = new App( {
	target: document.body,
	props: { sites: sites }
} );

export default app;