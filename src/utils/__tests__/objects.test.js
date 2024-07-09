import {describe, it, expect} from 'vitest';

import {filterObject} from '../objects.js';

describe('objects', () => {
	describe('filterObject', () => {
		it('should return an empty object when passed an empty object', () => {
			const input = {};
			const expected = {};
			const result = filterObject(input);
			expect(result).toEqual(expected);
		});

		it('should remove properties with undefined values', () => {
			const input = {
				a: 1,
				b: undefined,
				c: 'hello',
				d: null,
				e: undefined,
			};
			const expected = {
				a: 1,
				c: 'hello',
				d: null,
			};
			const result = filterObject(input);
			expect(result).toEqual(expected);
		});

		it('should not modify the original object', () => {
			const input = {
				a: 1,
				b: undefined,
				c: 'hello',
			};
			const originalObject = {...input};
			filterObject(input);
			expect(input).toEqual(originalObject);
		});

		it('should return the same object if all properties have defined values', () => {
			const input = {
				a: 1,
				b: null,
				c: 'hello',
			};
			const result = filterObject(input);
			expect(result).toEqual(input);
		});
	});
});
