// eslint-disable unicorn/filename-case
import {afterEach, expect, vi} from 'vitest';
import {cleanup} from '@testing-library/react';
import '@testing-library/jest-dom/vitest'; // eslint-disable-line import-x/no-unassigned-import

// Snapshot serializer to normalize file paths across different OS
expect.addSnapshotSerializer({
	test: value => typeof value === 'string' && value.includes('background-image: url('),
	serialize(value) {
		// Normalize path to use forward slashes and remove OS-specific prefixes
		return value.replaceAll(/background-image: url\("\/(@fs\/)?[^"]*\/(src\/images\/[^"]+)"\)/g, 'background-image: url("/$2")');
	},
});

// Mock localStorage for Node 25+ compatibility
// We need to mock it on Storage.prototype so tests can spy on it
const createLocalStorageMock = () => {
	const store = new Map();

	const mock = {
		getItem(key) {
			return store.get(key) ?? null;
		},
		setItem(key, value) {
			store.set(key, String(value));
		},
		removeItem(key) {
			store.delete(key);
		},
		clear() {
			store.clear();
		},
		get length() {
			return store.size;
		},
		key(index) {
			return [...store.keys()][index] ?? null;
		},
	};

	return mock;
};

// Set up localStorage on globalThis
if (globalThis.localStorage === undefined) {
	globalThis.localStorage = createLocalStorageMock();
}

// Runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
	cleanup();
	vi.clearAllMocks();
	vi.resetAllMocks();
	localStorage.clear();
});
