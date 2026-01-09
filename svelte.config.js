import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import rehypeAddClasses from 'rehype-add-classes';

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
	extensions: ['.md'],
	rehypePlugins: [
		[
			rehypeAddClasses,
			{
				p: 'print:break-inside-avoid'
			}
		]
	]
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [vitePreprocess(), mdsvex(mdsvexOptions)],
	kit: {
		adapter: adapter(),
		csrf: {
			trustedOrigins: ['http://remote-browser-service.railway.internal:3001']
		}
	},
	extensions: ['.svelte', '.md']
};

export default config;
