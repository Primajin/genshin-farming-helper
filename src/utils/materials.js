/**
 * Check if an array of numeric IDs forms a consecutive sequence (e.g., [104101, 104102, 104103]).
 * @param {number[]} ids - Sorted array of IDs
 * @returns {boolean}
 */
export const isConsecutiveIds = ids => ids.length > 1 && ids.every((id, i) => i === 0 || id === ids[i - 1] + 1);

/**
 * Find all tier IDs for a material by its sortRank.
 * Returns the sorted IDs if they form a consecutive sequence (indicating tiers of the same material),
 * or just the single materialId if they don't.
 * @param {number} materialId
 * @param {Array<{id: number, sortRank: number}>} allMaterials - Flat array of all materials
 * @returns {number[]} Sorted array of tier IDs
 */
export const getConsecutiveTierIds = (materialId, allMaterials) => {
	const material = allMaterials.find(m => m.id === materialId);
	if (!material) {
		return [materialId];
	}

	const sameSortRank = allMaterials.filter(m => m.sortRank === material.sortRank);
	sameSortRank.sort((a, b) => a.id - b.id);
	const ids = sameSortRank.map(m => m.id);

	return isConsecutiveIds(ids) ? ids : [materialId];
};
