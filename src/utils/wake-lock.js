/* global navigator */
/**
 * Utility module for managing screen wake locks.
 * @module wakeLock
 */

/**
 * The wake lock sentinel.
 * @type {WakeLockSentinel|null}
 */
let wakeLock = null;

/**
 * Attempts to request a screen wake lock.
 * @returns {Promise<boolean>} A promise that resolves to true if the wake lock is successfully requested, otherwise false.
 */
export const requestWakeLock = async () => {
	const navigatorWakelock = typeof navigator !== 'undefined' && navigator.wakeLock;
	if (!navigatorWakelock) {
		console.error('Wake Lock API not supported.');
		return false;
	}

	try {
		wakeLock = await navigatorWakelock.request();
		wakeLock.addEventListener('release', () => {
			console.debug('Screen Wake Lock released:', wakeLock.released);
		});
		console.debug('Screen Wake Lock requested.');
		return true;
	} catch (error) {
		console.error(`${error.name}, ${error.message}`);
		return false;
	}
};

/**
 * Releases the screen wake lock if it is currently held.
 * @returns {boolean} True if the wake lock was released, otherwise false.
 */
export const releaseWakeLock = async () => {
	if (wakeLock) {
		await wakeLock.release();
		wakeLock = null;
		return true;
	}

	return false;
};
