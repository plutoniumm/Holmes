import App from './App.svelte';
import sites from './data/sites.json'

const days = [
	{ 'name': 'D-Day', 'type': 'since', 'date': '08/06/2019', },
	{ 'name': 'Lockdown', 'type': 'till', 'date': '03/17/2020', },
];

const app = new App( {
	target: document.body,
	props: { sites: sites, days: days }
} );

export default app;