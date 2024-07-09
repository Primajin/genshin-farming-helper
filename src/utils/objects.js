/**
 * Filters an object by removing properties with undefined values.
 *
 * @param {Object} object - The object to be filtered.
 * @returns {Object} A new object with only the properties that have defined values.
 */
export const filterObject = object => {
	const returnValue = {};
	for (const key of Object.keys(object).filter(key => object[key] !== undefined)) {
		returnValue[key] = object[key];
	}

	return returnValue;
};
