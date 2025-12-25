// eslint-disable unicorn/filename-case
import {afterEach, expect, vi} from 'vitest';
import {cleanup} from '@testing-library/react';
import '@testing-library/jest-dom/vitest'; // eslint-disable-line import-x/no-unassigned-import

// Snapshot serializer to normalize file paths across different OS
expect.addSnapshotSerializer({
	test: value => typeof value === 'string' && value.includes('background-image: url("/@fs'),
	serialize(value) {
		// Normalize path to use forward slashes and remove OS-specific prefixes
		return value.replaceAll(/background-image: url\("\/(@fs\/)?[^"]*\/(src\/images\/[^"]+)"\);/g, '"background-image: url("/$2");"');
	},
});

// Runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
	cleanup();
	vi.clearAllMocks();
	vi.resetAllMocks();
	localStorage.clear();
});
