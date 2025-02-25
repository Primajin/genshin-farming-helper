/* global navigator */
/**
 * Utility module for managing screen wake locks.
 * @module wakeLock
 */

/**
 * Attempts to request a screen wake lock.
 * @param {WakeLockSentinel|null} wakeLockSentinel The current wake lock sentinel.
 * @returns {Promise<WakeLockSentinel|null>} A promise that resolves to the wake lock sentinel if the wake lock is successfully requested, otherwise null.
 */
export const requestWakeLock = async wakeLockSentinel => {
	const navigatorWakelock = typeof navigator !== 'undefined' && navigator.wakeLock;
	if (!navigatorWakelock) {
		console.error('Wake Lock API not supported.');
		return null;
	}

	try {
		wakeLockSentinel = await navigatorWakelock.request();
		wakeLockSentinel.addEventListener('release', () => {
			console.debug('Screen Wake Lock released:', wakeLockSentinel.released);
		});
		console.debug('Screen Wake Lock requested.');
		return wakeLockSentinel;
	} catch (error) {
		console.error(`${error.name}: ${error.message}`);
		return null;
	}
};

/**
 * Releases the screen wake lock if it is currently held.
 * @param {WakeLockSentinel|null} wakeLockSentinel The current wake lock sentinel.
 * @returns {Promise<WakeLockSentinel|null>} A promise that resolves to null if the wake lock was released, otherwise the wake lock sentinel.
 */
export const releaseWakeLock = async wakeLockSentinel => {
	if (wakeLockSentinel) {
		await wakeLockSentinel.release();
		return null;
	}

	return wakeLockSentinel;
};
