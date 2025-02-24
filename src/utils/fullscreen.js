/* global document */
// document may be used only after it has been checked against being undefined
export const fullscreenElement = typeof document !== 'undefined' && (document.fullscreenElement || document.mozFullscreenElement || document.msFullscreenElement || document.webkitFullscreenDocument);

/**
 * Toggles the specified Element into fullscreen mode - otherwise whole document
 * @param {string} [selector] the css selector; falls back to documentElement if undefined or not found
 */
export const toggleFullscreen = selector => {
	document.fullscreenElement = fullscreenElement;
	// eslint-disable-next-line logical-assignment-operators
	document.exitFullscreen = document.exitFullscreen || document.mozExitFullscreen || document.msExitFullscreen || document.webkitExitFullscreen;
	const queriedElement = selector && selector.length > 0 && document.querySelector(selector);
	const element = queriedElement || document.documentElement;
	const fallback = () => {};
	element.requestFullscreen = (element.requestFullscreen || element.mozRequestFullscreen || element.msRequestFullscreen || element.webkitRequestFullscreen) ?? fallback;

	if (!document.fullscreenElement) {
		element.requestFullscreen();
	} else if (document.exitFullscreen) {
		document.exitFullscreen();
	}
};
