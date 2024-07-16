/* global window */
import {describe, it, expect} from 'vitest';
import {isPRPreview} from '../url.js';

describe('isPRPreview', () => {
	it('should return true if the current URL includes "/pr-preview"', () => {
		// Mock the window.location object
		Object.defineProperty(window, 'location', {
			value: {
				pathname: '/some/path/pr-preview',
			},
			writable: false,
		});

		const result = isPRPreview();
		expect(result).toBe(true);
	});

	it('should return false if the current URL does not include "/pr-preview"', () => {
		// Mock the window.location object
		Object.defineProperty(window, 'location', {value: {pathname: '/some/other/path'}});
		const result = isPRPreview();
		expect(result).toBe(false);
	});

	it('should handle the case when window.location is undefined', () => {
		// Mock the window.location object to be undefined
		Object.defineProperty(window, 'location', {value: undefined});

		const result = isPRPreview();
		expect(result).toBe(false);
	});

	it('should handle the case when window in its entirety is undefined', () => {
		// eslint-disable-next-line no-global-assign
		window = undefined;

		const result = isPRPreview();
		expect(result).toBe(false);
	});
});
