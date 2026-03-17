import path from 'node:path';
import process from 'node:process';
import react from '@vitejs/plugin-react';
import mkcert from 'vite-plugin-mkcert';
// Import {codecovVitePlugin} from '@codecov/vite-plugin';
import {configDefaults, coverageConfigDefaults} from 'vitest/config';
import {defineConfig, searchForWorkspaceRoot} from 'vite';

export default defineConfig(() => ({
	base: '/',
	build: {
		outDir: 'build',
	},
	plugins: [
		...(process.env.NODE_ENV === 'test' ? [] : [mkcert()]),
		react(),
		// CodecovVitePlugin({
		// 	enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
		// 	bundleName: 'genshin-farming-helper',
		// 	uploadToken: process.env.CODECOV_TOKEN,
		// 	telemetry: false,
		// }),
	],
	resolve: {
		preserveSymlinks: true,
		alias: {
			components: path.resolve(import.meta.dirname, 'src/components'),
			constants: path.resolve(import.meta.dirname, 'src/constants'),
			data: path.resolve(import.meta.dirname, 'src/data.json'),
			'data-rare': path.resolve(import.meta.dirname, 'src/data-rare.json'),
			presets: path.resolve(import.meta.dirname, 'src/presets.json'),
			theme: path.resolve(import.meta.dirname, 'src/theme'),
			types: path.resolve(import.meta.dirname, 'src/types'),
			utils: path.resolve(import.meta.dirname, 'src/utils'),
			__tests__: path.resolve(import.meta.dirname, 'src/__tests__'),
		},
	},
	server: {
		https: process.env.NODE_ENV !== 'test',
		port: 3000,
		fs: {
			allow: [searchForWorkspaceRoot(process.cwd()), import.meta.dirname],
		},
	},
	test: {
		exclude: [
			...configDefaults.exclude,
			'src/index.jsx',
			'src/data.json',
			'src/data-rare.json',
		],
		coverage: {
			all: true,
			exclude: [...coverageConfigDefaults.exclude, './setup-tests.js', 'src/index.jsx', 'build/**'],
		},
		globals: true,
		environment: 'jsdom',
		setupFiles: './setup-tests.js',
	},
}));
