import time from './time.js';

async function getTweet(url) {
	const id = url.match(/[0-9]{19}/)[0];
	const res = await fetch(`/tweet/?id=${id}`);
	const tweet = await res.json();
	return [String(id), tweet];
}

function saveTweet(id, tweet) {
	let tweets = JSON.parse(localStorage.getItem('tweets')) || {};
	tweets[id] = tweet;
	tweets = Object.fromEntries(Object.entries(tweets).filter(([_, v]) => v != null));
	localStorage.setItem('tweets', JSON.stringify(tweets));
	return tweets;
}

function buildTweets(tweets) {
	const list = [];
	for (let id in tweets) {
		const t = tweets[id];
		list.push(`
				<li>
					<div class="image"><img src="${t.img}" /></div>
					<div class="content">
						<p>${t.text}</p>
						<p class="username">@${t.name} - ${time(new Date(t.date))}</p>
					</div>
					<div class="control">
						<a href="${t.url}"><img src="images/open.svg" /></a>
						<img onClick="deleteTweet('${id}')" src="images/close.svg" />
					</div>
				</li>
		`);
	}
	document.querySelector('ul').innerHTML = list.length
		? list.join('')
		: `<p class="nobmarks">👀 Looks like your don't have any bookmarks yet. Share tweets to this app to get going!</p>`;
}

window.onload = () => {
	const tweets = JSON.parse(localStorage.getItem('tweets')) || {};
	buildTweets(tweets);
};

window.deleteTweet = (id) => {
	const tweets = saveTweet(id, null);
	buildTweets(tweets);
};

// Share target
window.addEventListener('DOMContentLoaded', async () => {
	const url = new URL(window.location);
	const urlText = url.searchParams.get('text');
	if (!urlText) return;
	const [id, tweet] = await getTweet(urlText);
	const tweets = saveTweet(id, tweet);
	buildTweets(tweets);
});

// PWA install
let deferredPrompt;
const appHeader = document.querySelector('h2');
const installBtn = document.querySelector('button');

window.addEventListener('beforeinstallprompt', (e) => {
	e.preventDefault();
	deferredPrompt = e;
	installBtn.classList.remove('hide');
	appHeader.classList.remove('fancy');
});

installBtn.addEventListener('click', async () => {
	deferredPrompt.prompt();
	const { outcome } = await deferredPrompt.userChoice;
	if (outcome == 'accepted') deferredPrompt = null;
});
