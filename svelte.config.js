import adapter from '@sveltejs/adapter-vercel';

// NOTE: temporarily deploying to Vercel. The D1-backed blog routes won't work
// here (no Cloudflare bindings). To move back to Cloudflare Pages, swap this
// import for '@sveltejs/adapter-cloudflare' and restore the platformProxy config:
//
//   import adapter from '@sveltejs/adapter-cloudflare';
//   adapter({ platformProxy: { configPath: 'wrangler.jsonc', persist: true } })

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter()
	}
};

export default config;
