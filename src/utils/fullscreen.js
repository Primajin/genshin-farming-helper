/* global document */
// document may be used only after it has been checked against being undefined
export const fullscreenElement = document.fullscreenElement || document.mozFullscreenElement || document.msFullscreenElement || document.webkitFullscreenDocument;

/**
 * Toggles the specified Element into fullscreen mode - otherwise whole document
 * @param {string} [selector] the css selector; falls back to documentElement if undefined or not found
 */
export const toggleFullscreen = selector => {
	const exitFullscreenNotSupported = () => console.debug('Exit fullscreen is not supported');

	document.exitFullscreen = (document.exitFullscreen || document.mozExitFullscreen || document.msExitFullscreen || document.webkitExitFullscreen) ?? exitFullscreenNotSupported;

	const queriedElement = selector && selector.length > 0 && document.querySelector(selector);
	const element = queriedElement || document.documentElement;

	const fullscreenNotSupported = () => console.debug('Fullscreen is not supported');
	element.requestFullscreen = (element.requestFullscreen || element.mozRequestFullscreen || element.msRequestFullscreen || element.webkitRequestFullscreen) ?? fullscreenNotSupported;

	const fullscreenElement = document.fullscreenElement || document.mozFullscreenElement || document.msFullscreenElement || document.webkitFullscreenDocument;
	if (!fullscreenElement) {
		element.requestFullscreen();
	} else if (document.exitFullscreen) {
		document.exitFullscreen();
	}
};
