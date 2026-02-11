/* global document */
import {
	act, fireEvent, render, screen,
} from '@testing-library/react';
import {
	beforeEach, describe, expect, test, vi,
} from 'vitest';
import Main from 'components/pages/main.jsx';
import storage from 'utils/local-storage.js';

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

describe('debug preset overlapping', () => {
	beforeEach(() => {
		const eventTarget = new EventTarget();
		const originalNavigator = navigator;
		global.navigator = {
			...originalNavigator,
			wakeLock: {
				request: vi.fn().mockResolvedValue({
					addEventListener: eventTarget.addEventListener.bind(eventTarget),
					dispatchEvent: eventTarget.dispatchEvent.bind(eventTarget),
					release: vi.fn(),
					released: 'hello',
				}),
			},
		};
		storage.save({});
	});

	test('debug overlapping fish', async () => {
		render(<Main/>);

		const addPresetButton = screen.getByLabelText('Add preset');
		await act(() => {
			fireEvent.click(addPresetButton);
		});

		const fishingRodsTab = screen.getByText('Fishing Rods');
		await act(() => {
			fireEvent.click(fishingRodsTab);
		});

		// Add first fishing rod
		const rod1Checkbox = screen.getByLabelText('Test Fishing Rod 1');
		await act(() => {
			fireEvent.click(rod1Checkbox);
		});

		let storageState = storage.load();
		console.log('After rod1:', JSON.stringify(storageState, null, 2));

		// Add second fishing rod
		const rod2Checkbox = screen.getByLabelText('Test Fishing Rod 2');
		await act(() => {
			fireEvent.click(rod2Checkbox);
		});

		storageState = storage.load();
		console.log('After rod2:', JSON.stringify(storageState, null, 2));
	});
});
