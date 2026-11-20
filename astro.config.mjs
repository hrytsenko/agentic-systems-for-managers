// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const repo = 'https://github.com/hrytsenko/managing-agentic-delivery';

/**
 * A sidebar group listing the pages in one module directory.
 * Pages are ordered by `sidebar.order` in their frontmatter; the overview comes first.
 * @param {string} label
 * @param {string} directory
 */
const group = (label, directory) => ({ label, items: [{ autogenerate: { directory } }] });

// https://astro.build/config
export default defineConfig({
	site: 'https://hrytsenko.github.io',
	base: '/managing-agentic-delivery',
	integrations: [
		starlight({
			title: 'Managing Agentic Delivery',
			description: 'A lean guide for managers to talk about agents and bring them into delivery.',
			social: [{ icon: 'github', label: 'GitHub', href: repo }],
			customCss: ['./src/styles/custom.css'],
			sidebar: [group('AI Literacy', 'ai-literacy'), group('AI SDLC', 'ai-sdlc')],
		}),
	],
});
