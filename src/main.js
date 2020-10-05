import App from './App.svelte';

const sites = JSON.parse( '{"nf":{"name":"Netflix","icon":"./assets/ic/Netflix.svg","prelink":"https://www.netflix.com/search?q=","postlink":""},"git":{"name":"Github","icon":"./assets/ic/GitHub.svg","prelink":"https://github.com/search?&q=","postlink":"","me":"https://github.com/plutoniumblast?tab=repositories","new":"https://github.com/new","settings":"https://github.com/settings/profile","notifs":"https://github.com/notifications?query=is%3Aunread"},"g":{"name":"Google","icon":"./assets/ic/Google.svg","mail":"https://mail.google.com/","prelink":"https://www.google.com/search?q=","postlink":""},"gi":{"name":"Google Images","icon":"./assets/ic/GImages.svg","prelink":"https://www.google.com/search?q=","postlink":"&tbs=imgo:1,&tbm=isch"},"ddg":{"name":"DuckDuckGo","icon":"./assets/ic/DuckDuckGo.svg","prelink":"https://duckduckgo.com/?q=","postlink":""},"r":{"name":"Reddit","icon":"./assets/ic/Reddit.svg","prelink":"https://www.reddit.com/search?q=","postlink":""},"y":{"name":"Youtube","icon":"./assets/ic/Youtube.svg","prelink":"https://www.youtube.com/results?search_query=","postlink":"","new":"https://www.youtube.com/feed/subscriptions"},"ig":{"name":"Instagram","icon":"./assets/ic/Instagram.svg","prelink":"https://www.google.com/search?q=","postlink":" instagram","me":"https://www.instagram.com/plutonium.rar/","dm":"https://www.instagram.com/direct/inbox/"},"ap":{"name":"Amazon Prime","icon":"./assets/ic/Amazon.svg","prelink":"https://www.primevideo.com/search/ref=atv_nb_sr?phrase=","postlink":"&ie=UTF8"},"imdb":{"name":"IMDB","icon":"./assets/ic/IMDb.svg","prelink":"https://www.imdb.com/find?q=","postlink":"&ref_=nv_sr_sm"},"dict":{"name":"Merriam Webster","icon":"./assets/ic/Webster.svg","prelink":"https://www.merriam-webster.com/dictionary/","postlink":""},"wiki":{"name":"Wikipedia","icon":"./assets/ic/Wikipedia.svg","prelink":"https://en.wikipedia.org/wiki/Special:Search?search=","postlink":""},">":{"name":"Functions","icon":"./assets/ic/Terminal.svg","now":"time.is","mail":"https://www.icloud.com/mail/"},"ht":{"name":"Links","icon":"./assets/ic/Web.svg","prelink":"https://","postlink":""}}' );

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
	props: { sites: sites, links: links, days: days }
} );

export default app;