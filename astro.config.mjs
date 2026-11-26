// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const repo = 'https://github.com/hrytsenko/enterprise-agentic-systems';

// https://astro.build/config
export default defineConfig({
	site: 'https://hrytsenko.github.io',
	base: '/enterprise-agentic-systems',
	integrations: [
		starlight({
			title: 'Enterprise Agentic Systems',
			description: 'A lean guide for managers and staff engineers to the concepts, costs, and risks of agentic systems for business.',
			social: [{ icon: 'github', label: 'GitHub', href: repo }],
			customCss: ['./src/styles/custom.css'],
			sidebar: ['governed-agents', 'sovereign-models', 'semantic-data'],
		}),
	],
});
