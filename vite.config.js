import path from 'node:path';
import process from 'node:process';
import {fileURLToPath} from 'node:url';
import {defineConfig, searchForWorkspaceRoot} from 'vite';
import react from '@vitejs/plugin-react';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(() => ({
	base: '/genshin-farming-helper',
	build: {
		outDir: 'build',
	},
	plugins: [react()],
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
		coverage: {
			all: true,
		},
		globals: true,
		environment: 'jsdom',
		setupFiles: './setup-tests.js',
	},
}));