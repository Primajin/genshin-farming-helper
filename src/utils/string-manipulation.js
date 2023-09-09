/**
 * Clean up the name of any characters that are not compatible with the URL
 * @param {string} name - The name to clean up
 * @returns {string}
 */
export const cleanName = name => name.toLowerCase().replaceAll(' ', '_').replaceAll(/\W/g, '').replaceAll('__', '_');
