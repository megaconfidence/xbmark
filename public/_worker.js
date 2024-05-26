export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);
		const id = url.searchParams.get('id');
		if (id) {
			const res = await fetch(`https://cdn.syndication.twimg.com/tweet-result?id=${id}&token=0`, {
				headers: { 'User-Agent': 'Chrome/125' },
			});
			const tweet = await res.json();
			return Response.json({
				text: tweet.text,
				name: tweet.user.name,
				date: tweet.created_at,
				img: tweet.user.profile_image_url_https,
				url: `https://x.com/${tweet.user.screen_name}/status/${id}`,
			});
		}
		return env.ASSETS.fetch(request);
	},
};
