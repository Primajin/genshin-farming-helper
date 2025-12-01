/* global localStorage */
import {
	act, fireEvent, render, screen,
} from '@testing-library/react';
import {
	describe, expect, test, vi,
} from 'vitest';

import Main from '../main.jsx';

vi.mock('../../__tests__/__mocks__/local-storage.js', async () => {
	const actual = await vi.importActual('../../__tests__/__mocks__/local-storage.js');
	return actual;
});

const localStorageModule = await import('../../__tests__/__mocks__/local-storage.js');
const localStorageState = localStorageModule.default;

vi.mock('../../data.json', async () => {
	const {materials} = await vi.importActual('../../__tests__/__mocks__/data.js');
	return {
		default: {
			...materials,
		},
	};
});

vi.mock('../../data-rare.json', async () => {
	const {materialsRare} = await vi.importActual('../../__tests__/__mocks__/data.js');
	return {
		default: {
			...materialsRare,
		},
	};
});

const prototypeOfLocalStorage = Object.getPrototypeOf(localStorage);

describe('main with pre-saved helpers', () => {
	test('renders without crashing', async () => {
		vi.spyOn(prototypeOfLocalStorage, 'getItem').mockReturnValue(JSON.stringify(localStorageState));
		const rendering = render(<Main/>);
		expect(rendering).toMatchSnapshot();

		const removeButtons = screen.getAllByTitle('Remove item');
		await act(() => {
			fireEvent.click(removeButtons[0]);
		});
		expect(rendering).toMatchSnapshot();
	});
});
