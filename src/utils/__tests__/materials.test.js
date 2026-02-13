import {describe, expect, test} from 'vitest';
import {getConsecutiveTierIds, isConsecutiveIds} from 'utils/materials.js';

describe('materials', () => {
	describe('isConsecutiveIds', () => {
		test('returns true for consecutive IDs', () => {
			expect(isConsecutiveIds([101, 102, 103])).toBe(true);
			expect(isConsecutiveIds([1, 2])).toBe(true);
		});

		test('returns false for non-consecutive IDs', () => {
			expect(isConsecutiveIds([101, 103, 105])).toBe(false);
			expect(isConsecutiveIds([1, 3])).toBe(false);
		});

		test('returns false for a single ID', () => {
			expect(isConsecutiveIds([101])).toBe(false);
		});

		test('returns false for empty array', () => {
			expect(isConsecutiveIds([])).toBe(false);
		});
	});

	describe('getConsecutiveTierIds', () => {
		const allMaterials = [
			{id: 101, sortRank: 1},
			{id: 102, sortRank: 1},
			{id: 103, sortRank: 1},
			{id: 200, sortRank: 2},
			{id: 300, sortRank: 3},
			{id: 305, sortRank: 3},
		];

		test('returns all tier IDs for consecutive materials', () => {
			expect(getConsecutiveTierIds(101, allMaterials)).toEqual([101, 102, 103]);
			expect(getConsecutiveTierIds(103, allMaterials)).toEqual([101, 102, 103]);
		});

		test('returns single ID for standalone materials', () => {
			expect(getConsecutiveTierIds(200, allMaterials)).toEqual([200]);
		});

		test('returns single ID for non-consecutive same-sortRank', () => {
			expect(getConsecutiveTierIds(300, allMaterials)).toEqual([300]);
			expect(getConsecutiveTierIds(305, allMaterials)).toEqual([305]);
		});

		test('returns single ID if material not found', () => {
			expect(getConsecutiveTierIds(999, allMaterials)).toEqual([999]);
		});
	});
});
