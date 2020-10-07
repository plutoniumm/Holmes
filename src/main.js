import App from './App.svelte';
import sites from './data/sites.json'

const links = [
	{ 'name': 'DigialOcean', 'link': 'https://cloud.digitalocean.com/login', },
	{ 'name': 'FontAwesome', 'link': 'https://fontawesome.com/icons?d=gallery&m=free', },
	{ 'name': 'Firebase', 'link': 'http://console.firebase.google.com/', },
	{ 'name': 'Figma', 'link': 'https://www.figma.com/files/recent', },
	{ 'name': 'GoDaddy', 'link': 'https://sso.godaddy.com/?realm=idp&path=%2Fproducts&app=account', },
	{ 'name': 'CodePen', 'link': 'https://codepen.io', }
];

const days = [
	{ 'name': 'D-Day', 'type': 'since', 'date': '08/06/2019', },
	{ 'name': 'Lockdown', 'type': 'till', 'date': '03/17/2020', },
];

const app = new App( {
	target: document.body,
	props: { sites: sites, days: days, links: links }
} );

export default app;