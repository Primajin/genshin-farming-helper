// eslint-disable unicorn/filename-case
import {afterEach} from 'vitest';
import {cleanup} from '@testing-library/react';
import '@testing-library/jest-dom/vitest'; // eslint-disable-line import/no-unassigned-import,n/file-extension-in-import

// Runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
	cleanup();
});
