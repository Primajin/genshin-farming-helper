/* global localStorage */
import {
	describe, test, vi, expect,
} from 'vitest';

import storage from '../local-storage.js';
import * as urlUtils from '../url.js';

vi.mock('../../__tests__/__mocks__/local-storage.js', () => ({
	default: {mockKey: 'mockValue'},
}));

const prototypeOfLocalStorage = Object.getPrototypeOf(localStorage);

describe('local-storage', () => {
	describe('storage.load', () => {
		test('should return value from mocked file when isPRPreview is true', () => {
			vi.spyOn(urlUtils, 'isPRPreview').mockReturnValue(true);
			const localStorageState = {mockKey: 'mockValue'};
			expect(storage.load()).toEqual(localStorageState);
		});

		test('should return parsed value from localStorage when isPRPreview is false', () => {
			vi.spyOn(urlUtils, 'isPRPreview').mockReturnValue(false);
			const mockValue = {realKey: 'realValue'};
			vi.spyOn(prototypeOfLocalStorage, 'getItem').mockReturnValue(JSON.stringify(mockValue));
			expect(storage.load()).toEqual(mockValue);
		});
	});

	describe('storage.save', () => {
		test('should save the stringified value to localStorage', () => {
			const mockValue = {someKey: 'someValue'};
			const setItemSpy = vi.spyOn(prototypeOfLocalStorage, 'setItem');
			storage.save(mockValue);
			expect(setItemSpy).toHaveBeenCalledWithExactlyOnceWith('genshin-farming-helper', JSON.stringify(mockValue));
		});
	});
});
