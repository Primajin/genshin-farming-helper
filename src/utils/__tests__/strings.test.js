import {describe, test, expect} from 'vitest';

import {removeQuotesFromString} from '../strings.js';

describe('strings', () => {
	describe('removeQuotesFromString', () => {
		test('should remove quotes from a string at the beginning and the end', () => {
			const string = '"hello"';
			const result = removeQuotesFromString(string);
			expect(result).toBe('hello');
		});

		test('should not alter a string with no quotes', () => {
			const string = 'hello';
			const result = removeQuotesFromString(string);
			expect(result).toBe('hello');
		});

		test('should not remove quotes from a string with quotes in the middle', () => {
			const string = 'hello "there" world';
			const result = removeQuotesFromString(string);
			expect(result).toBe('hello "there" world');
		});
	});
});
