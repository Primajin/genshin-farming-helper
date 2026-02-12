
import {
	beforeEach, describe, expect, test, vi,
} from 'vitest';
import {
	act, fireEvent, render, screen,
} from '@testing-library/react';

import Main from '../pages/main.jsx';
import storage from '../../utils/local-storage.js';

// Mock the data and presets
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

describe('Preset removal', () => {
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

	test('should remove helpers when clicking an active preset', async () => {
		render(<Main/>);

		// Step 1: Add "Test Character" preset
		const addPresetButton = screen.getByLabelText('Add preset');
		await act(() => {
			fireEvent.click(addPresetButton);
		});

		const testCharCheckbox = screen.getByLabelText('Test Character');
		await act(() => {
			fireEvent.click(testCharCheckbox);
		});

		// Verify helpers were added
		let storageState = storage.load();
		const helperCountAfterAdd = Object.keys(storageState.helpers).length;
		expect(helperCountAfterAdd).toBeGreaterThan(0);
		console.log('After adding preset:', {
			helperCount: helperCountAfterAdd,
			presets: storageState.presets,
		});

		// Step 2: Click the same preset again to remove it
		await act(() => {
			fireEvent.click(testCharCheckbox);
		});

		// Verify helpers were removed
		storageState = storage.load();
		const helperCountAfterRemove = Object.keys(storageState.helpers).length;
		console.log('After removing preset:', {
			helperCount: helperCountAfterRemove,
			presets: storageState.presets,
		});

		// All helpers should be removed (or at least significantly reduced)
		// Test Character has multiple materials, so after removal, count should be 0
		expect(helperCountAfterRemove).toBe(0);
	});

	test('should toggle preset on and off correctly', async () => {
		render(<Main/>);

		const addPresetButton = screen.getByLabelText('Add preset');
		await act(() => {
			fireEvent.click(addPresetButton);
		});

		const testCharCheckbox = screen.getByLabelText('Test Character');

		// Click 1: Add preset
		await act(() => {
			fireEvent.click(testCharCheckbox);
		});

		let storageState = storage.load();
		const countAfterClick1 = Object.keys(storageState.helpers).length;
		expect(countAfterClick1).toBeGreaterThan(0);
		expect(storageState.presets).toContain('character.10000005');

		// Click 2: Remove preset
		await act(() => {
			fireEvent.click(testCharCheckbox);
		});

		storageState = storage.load();
		const countAfterClick2 = Object.keys(storageState.helpers).length;
		expect(countAfterClick2).toBe(0);
		expect(storageState.presets).not.toContain('character.10000005');

		// Click 3: Add preset again
		await act(() => {
			fireEvent.click(testCharCheckbox);
		});

		storageState = storage.load();
		const countAfterClick3 = Object.keys(storageState.helpers).length;
		expect(countAfterClick3).toBe(countAfterClick1); // Should match first add
		expect(storageState.presets).toContain('character.10000005');
	});
});
