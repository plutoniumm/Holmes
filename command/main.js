import App from './App.svelte';
import sites from './core/sites.json';
const app = new App( { target: document.body, props: { sites: sites } } );
export default app;