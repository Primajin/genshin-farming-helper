// eslint-disable unicorn/filename-case
import {afterEach, vi} from 'vitest';
import {cleanup} from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
	cleanup();
	vi.clearAllMocks();
	vi.resetAllMocks();
});
