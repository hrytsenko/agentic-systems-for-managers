// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const repo = 'https://github.com/hrytsenko/agentic-systems-for-managers';

// https://astro.build/config
export default defineConfig({
	site: 'https://hrytsenko.github.io',
	base: '/agentic-systems-for-managers',
	integrations: [
		starlight({
			title: 'Agentic Systems for Managers',
			description: 'A lean guide to the concepts, costs, and risks of agentic systems.',
			social: [{ icon: 'github', label: 'GitHub', href: repo }],
			customCss: ['./src/styles/custom.css'],
			sidebar: ['agents', 'platforms', 'data'],
		}),
	],
});
