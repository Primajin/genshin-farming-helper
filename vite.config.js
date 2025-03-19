import path from 'node:path';
import process from 'node:process';
import {fileURLToPath} from 'node:url';
import react from '@vitejs/plugin-react';
import {codecovVitePlugin} from '@codecov/vite-plugin';
import {configDefaults, coverageConfigDefaults} from 'vitest/config';
import {defineConfig, searchForWorkspaceRoot} from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(() => ({
	base: '/',
	build: {
		outDir: 'build',
	},
	plugins: [
		react(),
		codecovVitePlugin({
			enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
			bundleName: 'genshin-farming-helper',
			uploadToken: process.env.CODECOV_TOKEN,
			telemetry: false
		}),
	],
	resolve: {
		preserveSymlinks: true,
	},
	server: {
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
		],
		coverage: {
			all: true,
			exclude: ['src/index.jsx', ...coverageConfigDefaults.exclude],
		},
		globals: true,
		environment: 'jsdom',
		setupFiles: './setup-tests.js',
	},
}));
