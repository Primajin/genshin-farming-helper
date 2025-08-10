import {describe, test, expect} from 'vitest';

import {isPRPreview} from '../url.js';

describe('isPRPreview', () => {
	test('should return true if the current URL includes "/pr-preview"', () => {
		// Mock the window.location object
		Object.defineProperty(global, 'location', {
			value: {
				pathname: '/some/path/pr-preview',
			},
			writable: false,
		});

		const result = isPRPreview();
		expect(result).toBeTruthy();
	});

	test('should return false if the current URL does not include "/pr-preview"', () => {
		// Mock the window.location object
		Object.defineProperty(global, 'location', {value: {pathname: '/some/other/path'}});
		const result = isPRPreview();
		expect(result).toBeFalsy();
	});

	test('should handle the case when window.location is undefined', () => {
		// Mock the window.location object to be undefined
		Object.defineProperty(global, 'location', {value: undefined});

		const result = isPRPreview();
		expect(result).toBeFalsy();
	});

	test('should handle the case when window in its entirety is undefined', () => {
		// eslint-disable-next-line no-global-assign,no-implicit-globals
		global = undefined;

		const result = isPRPreview();
		expect(result).toBeFalsy();
	});
});
