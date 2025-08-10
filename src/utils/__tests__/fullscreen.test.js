/* global document */
import {
	beforeEach, describe, expect, test, vi,
} from 'vitest';

import {toggleFullscreen} from '../fullscreen.js';

describe('toggleFullscreen', () => {
	beforeEach(() => {
		const originalDocument = global.document;
		global.document = {
			...originalDocument,
			fullscreenElement: null,
			documentElement: {},
			querySelector: vi.fn(),
			exitFullscreen: vi.fn(),
		};
	});

	test('should enter fullscreen mode when no element is in fullscreen', () => {
		const element = {requestFullscreen: vi.fn()};
		const querySpy = vi.spyOn(document, 'querySelector').mockReturnValue(element);
		toggleFullscreen('#test');
		expect(querySpy).toHaveBeenCalledWith('#test');
		expect(element.requestFullscreen).toHaveBeenCalled();
	});

	test('should fallback to documentElement if selector is not provided', () => {
		document.documentElement.requestFullscreen = vi.fn();
		toggleFullscreen();
		expect(document.documentElement.requestFullscreen).toHaveBeenCalled();
	});

	test('should exit fullscreen mode when an element is in fullscreen', () => {
		document.fullscreenElement = {};
		toggleFullscreen();
		expect(document.exitFullscreen).toHaveBeenCalled();
	});

	test('should not throw an error if requestFullscreen is not supported', () => {
		const element = {};
		const consoleSpy = vi.spyOn(console, 'debug');
		vi.spyOn(document, 'querySelector').mockReturnValue(element);
		expect(() => toggleFullscreen('#test')).not.toThrow();
		expect(consoleSpy).toHaveBeenCalledWith('Fullscreen is not supported');
	});

	test('should not throw an error if exitFullscreen is not supported', () => {
		document.fullscreenElement = {};
		document.exitFullscreen = undefined;
		const consoleSpy = vi.spyOn(console, 'debug');
		expect(() => toggleFullscreen('#test')).not.toThrow();
		expect(consoleSpy).toHaveBeenCalledWith('Exit fullscreen is not supported');
	});
});
