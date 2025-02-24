/* global navigator */
import {
	describe, test, expect, vi, afterEach,
} from 'vitest';

import {requestWakeLock, releaseWakeLock} from '../wake-lock.js';

describe('wake lock', () => {
	global.navigator.wakeLock = {
		request: vi.fn().mockResolvedValue({
			addEventListener: vi.fn(),
			release: vi.fn(),
		}),
	};

	afterEach(() => {
		vi.clearAllMocks();
		vi.resetModules();
	});

	describe('requestWakeLock', () => {
		test('should request a wake lock successfully', async () => {
			const result = await requestWakeLock();
			expect(result).toBe(true);
		});

		test('should handle errors when requesting a wake lock', async () => {
			global.navigator.wakeLock.request = vi.fn().mockRejectedValue(new Error('Test error'));
			const result = await requestWakeLock();
			expect(result).toBe(false);
		});
	});

	describe.skip('releaseWakeLock', () => {
		test('should release the wake lock successfully', async () => {
			await requestWakeLock();
			const result = await releaseWakeLock();
			expect(result).toBe(true);
		});

		test('should return false if there is no wake lock to release', async () => {
			const result = await releaseWakeLock();
			expect(result).toBe(false);
		});
	});
});
