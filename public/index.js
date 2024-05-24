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
	for (id in tweets) {
		const t = tweets[id];
		list.push(`
				<li>
					<div class="image"><img src="${t.img}" /></div>
					<a href="${t.url}">
						<div class="content">
							<p class="username">@${t.name}</p>
							<p>${t.text}</p>
						</div>
					</a>
					<div class="delete" onClick="deleteTweet('${id}')">🗑️</div>
				</li>
		`);
	}
	document.querySelector('ul').innerHTML = list.join('');
}

function loadTweets() {
	const tweets = JSON.parse(localStorage.getItem('tweets')) || {};
	buildTweets(tweets);
}

window.onload = loadTweets;

function deleteTweet(id) {
	const tweets = saveTweet(id, null);
	buildTweets(tweets);
}

window.addEventListener('DOMContentLoaded', async () => {
	const [id, tweet] = await getTweet('https://twitter.com/_olanetsoft/status/1793786263138664537/photo/1');
	const tweets = saveTweet(id, tweet);
	buildTweets(tweets);
	//
	// const url = new URL(window.location);
	// const [id, tweet] = await getTweet(url.searchParams.get('text'));
	// const tweets = saveTweet(id, tweet);
	// buildTweets(tweets);
});

// Initialize deferredPrompt for use later to show browser install prompt.
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
	// Prevent the mini-infobar from appearing on mobile
	e.preventDefault();
	// Stash the event so it can be triggered later.
	deferredPrompt = e;
	// Update UI notify the user they can install the PWA
	// Optionally, send analytics event that PWA install promo was shown.
	console.log(`'beforeinstallprompt' event was fired.`);
});
document.querySelector('button').addEventListener('click', async () => {
	// Hide the app provided install promotion
	// Show the install prompt
	deferredPrompt.prompt();
	// Wait for the user to respond to the prompt
	const { outcome } = await deferredPrompt.userChoice;
	// Optionally, send analytics event with outcome of user choice
	console.log(`User response to the install prompt: ${outcome}`);
	// We've used the prompt and can't use it again, throw it away
	deferredPrompt = null;
});
