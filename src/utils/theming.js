/* global window */
// window may be used only after it has been checked against being undefined
/**
 * Does user prefer dark mode UI in Operating System settings?
 * @type {boolean}
 */
export const userPrefersDark = typeof window !== 'undefined' && window && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

/**
 * Breakpoints for devices
 * @type {Map<string, number>}
 */
export const breakpoints = new Map([['sm', 576], ['md', 768], ['lg', 992], ['xl', 1200]]);

/**
 * Gets media query for given breakpoint
 * @param {('sm'|'md'|'lg'|'xl'|number)} breakpoint The name of the breakpoint or a custom number
 * @returns {('576px'|'768px'|'992px'|'1200px'|'custompx')} The media query with min-width going UP
 */
export const up = breakpoint => `@media (min-width: ${breakpoints.get(breakpoint) ?? breakpoint}px)`;

/**
 * Device specific input modes
 * @type {Map<string, string[]>}
 */
export const deviceSpecs = new Map([['touchscreen', ['none', 'coarse']], ['stylus', ['none', 'fine']], ['motion-sense', ['hover', 'coarse']], ['mouse', ['hover', 'fine']]]);

/**
 * Gets media query for given device
 * @param {('touchscreen'|'stylus'|'motion-sense'|'mouse')} breakpoint The name of the breakpoint
 * @returns {('none, coarse'|'none, fine'|'hover, coarse'|'hover, fine')} The media query with corresponding device specs
 */
export const forDevice = breakpoint => `@media (hover: ${deviceSpecs.get(breakpoint)[0]}) and (pointer: ${deviceSpecs.get(breakpoint)[1]})`;
