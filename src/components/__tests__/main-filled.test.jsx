/* global localStorage */
import {fireEvent, render, screen} from '@testing-library/react';
import {
	describe, expect, it, vi,
} from 'vitest';

import Main from '../main.jsx';
import localStorageState from '../../__tests__/__mocks__/local-storage.js';

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

describe('Main with pre-saved helpers', () => {
	it('renders without crashing', () => {
		vi.spyOn(prototypeOfLocalStorage, 'getItem').mockReturnValue(JSON.stringify(localStorageState));
		const rendering = render(<Main/>);
		expect(rendering).toMatchSnapshot();

		const removeButtons = screen.getAllByTitle('Remove item');
		fireEvent.click(removeButtons[0]);
		expect(rendering).toMatchSnapshot();
	});
});
