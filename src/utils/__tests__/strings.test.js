import {describe, it, expect} from 'vitest';

import {removeQuotesFromString} from '../strings.js';

describe('strings', () => {
	describe('removeQuotesFromString', () => {
		it('should remove quotes from a string at the beginning and the end', () => {
			const string = '"hello"';
			const result = removeQuotesFromString(string);
			expect(result).toBe('hello');
		});

		it('should not alter a string with no quotes', () => {
			const string = 'hello';
			const result = removeQuotesFromString(string);
			expect(result).toBe('hello');
		});

		it('should not remove quotes from a string with quotes in the middle', () => {
			const string = 'hello "there" world';
			const result = removeQuotesFromString(string);
			expect(result).toBe('hello "there" world');
		});
	});
});
