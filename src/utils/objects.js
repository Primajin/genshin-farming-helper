/**
 * Filters an object by removing properties with undefined values.
 *
 * @param {object} object - The object to be filtered.
 * @returns {object} A new object with only the properties that have defined values.
 */
export const filterObject = object => {
	const returnValue = {};
	for (const [key, value] of Object.entries(object)) {
		if (value !== undefined) {
			returnValue[key] = value;
		}
	}

	return returnValue;
};
