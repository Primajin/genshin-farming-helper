import path from 'node:path';
import process from 'node:process';
import {fileURLToPath} from 'node:url';
import react from '@vitejs/plugin-react';
import mkcert from 'vite-plugin-mkcert';
// Import {codecovVitePlugin} from '@codecov/vite-plugin';
import {configDefaults, coverageConfigDefaults} from 'vitest/config';
import {defineConfig, searchForWorkspaceRoot} from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
			components: path.resolve(__dirname, 'src/components'),
			constants: path.resolve(__dirname, 'src/constants'),
			data: path.resolve(__dirname, 'src/data.json'),
			'data-rare': path.resolve(__dirname, 'src/data-rare.json'),
			presets: path.resolve(__dirname, 'src/presets.json'),
			theme: path.resolve(__dirname, 'src/theme'),
			types: path.resolve(__dirname, 'src/types'),
			utils: path.resolve(__dirname, 'src/utils'),
			__tests__: path.resolve(__dirname, 'src/__tests__'),
		},
	},
	server: {
		https: process.env.NODE_ENV !== 'test',
		port: 3000,
		fs: {
			allow: [searchForWorkspaceRoot(process.cwd()), __dirname],
		},
	},
	test: {
		exclude: [
			...configDefaults.exclude,
			'src/index.jsx',
			'src/data.json',
			'src/data-rare.json',
			'e2e/**',
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
