import {
	beforeEach, describe, expect, test, vi,
} from 'vitest';

import {releaseWakeLock, requestWakeLock} from '../wake-lock.js';

describe('wake lock', () => {
	beforeEach(() => {
		const eventTarget = new EventTarget();
		const originalNavigator = navigator;
		global.navigator = {
			...originalNavigator,
			wakeLock: {
				request: vi.fn().mockResolvedValue({
					addEventListener: eventTarget.addEventListener.bind(eventTarget),
					dispatchEvent: eventTarget.dispatchEvent.bind(eventTarget),
					release: vi.fn(),
					released: 'hello',
				}),
			},
		};
	});

	describe('request lock', () => {
		test('should request a wake lock successfully', async () => {
			const consoleSpy = vi.spyOn(console, 'debug');
			const wakeLockSentinel = null;
			const result = await requestWakeLock(wakeLockSentinel);
			// Const sentinelSpy = vi.spyOn(result, 'addEventListener');
			expect(result).not.toBeNull();
			// Expect(result.addEventListener).toHaveBeenCalledWith('release', expect.any(Function));
			expect(consoleSpy).toHaveBeenCalledWithExactlyOnceWith('Screen Wake Lock requested.');
			result.dispatchEvent(new Event('release'));
			expect(consoleSpy).toHaveBeenCalledWithExactlyOnceWith('Screen Wake Lock released:', 'hello');
		});

		test('should handle errors when Wake Lock API is not supported.', async () => {
			global.navigator.wakeLock = null;
			const consoleSpy = vi.spyOn(console, 'error');
			const wakeLockSentinel = null;
			const result = await requestWakeLock(wakeLockSentinel);
			expect(result).toBeNull();
			expect(consoleSpy).toHaveBeenCalledWithExactlyOnceWith('Wake Lock API not supported.');
		});

		test('should handle errors when requesting a wake lock', async () => {
			global.navigator.wakeLock.request = vi.fn().mockRejectedValue(new Error('Test error'));
			const consoleSpy = vi.spyOn(console, 'error');
			const wakeLockSentinel = null;
			const result = await requestWakeLock(wakeLockSentinel);
			expect(result).toBeNull();
			expect(consoleSpy).toHaveBeenCalledWithExactlyOnceWith('Error: Test error');
		});
	});

	describe('release lock', () => {
		test('should release the wake lock successfully', async () => {
			let wakeLockSentinel = null;
			wakeLockSentinel = await requestWakeLock(wakeLockSentinel);
			expect(wakeLockSentinel).not.toBeNull();
			const result = await releaseWakeLock(wakeLockSentinel);
			expect(result).toBeNull();
		});

		test('should return null if there is no wake lock to release', async () => {
			const wakeLockSentinel = null;
			const result = await releaseWakeLock(wakeLockSentinel);
			expect(result).toBeNull();
		});
	});
});
