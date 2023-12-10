/**
 * Removes any quotation marks from the beginning and end of a string
 * @param {string} string - The input string that may contain quotation marks
 * @returns {string} The string without any quotation marks
 */
export const removeQuotesFromString = string => string.replace(/^["'](.+(?=["']$))["']$/, '$1');
