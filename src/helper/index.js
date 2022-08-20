/**
 * Gets offset for the given length.
 * @param {number} length
 * @returns {number}
 */
export const getOffset = length => {
	const hasJustOne = length === 1;
	const hasTierFour = length > 3;

	return hasJustOne ? 3 : (hasTierFour ? 1 : 0);
};

/**
 * Gets reversed offset for the given length.
 * @param {number} length
 * @returns {number}
 */
export const getReverseOffset = length => {
	const hasJustOne = length === 1;
	const hasTierFour = length > 3;

	return hasJustOne ? 4 : (hasTierFour ? 5 : 3);
};
