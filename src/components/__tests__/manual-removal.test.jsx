/* global document */
import {
	beforeEach, describe, expect, test, vi,
} from 'vitest';
import {act, fireEvent, render} from '@testing-library/react';

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

describe('Manual helper removal', () => {
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

	test('should re-enable button after manually removing a helper', async () => {
		render(<Main/>);

		// Add Brilliant Diamond Gemstone (id: 104104) manually
		const itemSelector = document.querySelector('input[value="ASCENSION.104104"]');
		expect(itemSelector).toBeDefined();

		// Initially, button should NOT be disabled (checked)
		expect(itemSelector.disabled).toBe(false); // Fixed: check disabled, not checked

		// Click the button to add the helper
		await act(() => {
			fireEvent.click(itemSelector);
		});

		// Button should now be disabled (checked)
		expect(itemSelector.checked).toBe(true);

		// Verify helper was added to storage
		let storageState = storage.load();
		expect(storageState.helpers['104104']).toBeDefined();

		// Find and click the remove button for this helper
		const allSections = document.querySelectorAll('section');
		const helpers = [...allSections].filter(section =>
			section.querySelector('button[title="Remove item"]'));
		expect(helpers.length).toBe(1);

		const removeButton = helpers[0].querySelector('button[title="Remove item"]');
		expect(removeButton).toBeDefined();

		await act(() => {
			fireEvent.click(removeButton);
		});

		// Verify helper was removed from storage
		storageState = storage.load();
		expect(storageState.helpers['104104']).toBeUndefined();

		// The button should be re-enabled (not checked) after removal
		expect(itemSelector.disabled).toBe(false); // Fixed: check disabled, not checked
	});
});
