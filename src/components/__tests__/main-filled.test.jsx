import {
	act, fireEvent, render, screen,
} from '@testing-library/react';
import {
	describe, expect, test, vi,
} from 'vitest';
import Main from 'components/pages/main.jsx';

vi.mock('data', async () => {
	const {materials} = await vi.importActual('__tests__/__mocks__/data.js');
	return {
		default: {
			...materials,
		},
	};
});

vi.mock('data-rare', async () => {
	const {materialsRare} = await vi.importActual('__tests__/__mocks__/data.js');
	return {
		default: {
			...materialsRare,
		},
	};
});

vi.mock('presets', async () => {
	const {presets} = await vi.importActual('__tests__/__mocks__/presets.js');
	return {
		default: {
			...presets,
		},
	};
});

const localStorageModule = await import('__tests__/__mocks__/local-storage.js');
const localStorageState = localStorageModule.default;

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
