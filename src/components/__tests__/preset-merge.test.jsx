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

describe('preset merge with existing items', () => {
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
		// Clear storage before each test
		storage.save({});
	});

	test('should merge preset goals with manually added item (add item first, then preset)', async () => {
		// Test case: Add Gemstone first
		// 1. Add Brilliant Diamond Gemstone manually
		// 2. Note: User can't easily change goals in the test without the full UI, so we'll just verify merging works
		// 3. Add "Test Character" preset (which also has Brilliant Diamond items)
		// Expected: Goals should be combined

		render(<Main/>);

		// Step 1: Add Brilliant Diamond Gemstone (id: 104104) manually
		// This is the highest tier (Gemstone) of Brilliant Diamond
		const itemSelector = document.querySelector('input[value="ASCENSION.104104"]');
		expect(itemSelector).toBeDefined();

		await act(() => {
			fireEvent.click(itemSelector);
		});

		// Verify item was added
		const allSectionsAfterManual = document.querySelectorAll('section');
		const helpersAfterManual = [...allSectionsAfterManual].filter(section =>
			section.querySelector('button[title="Remove item"]'));

		expect(helpersAfterManual.length).toBe(1);

		// Step 2: Add "Test Character" preset which includes Brilliant Diamond items
		const addPresetButton = screen.getByLabelText('Add preset');
		await act(() => {
			fireEvent.click(addPresetButton);
		});

		const testCharCheckbox = screen.getByLabelText('Test Character');
		await act(() => {
			fireEvent.click(testCharCheckbox);
		});

		// Expected: Still only ONE helper for Brilliant Diamond (no duplicate)
		const allSections = document.querySelectorAll('section');
		const helpers = [...allSections].filter(section =>
			section.querySelector('button[title="Remove item"]'));

		// Filter to only Brilliant Diamond helpers
		const diamondHelpers = helpers.filter(h => {
			const img = h.querySelector('img');
			return img && (img.alt.includes('Brilliant Diamond'));
		});

		expect(diamondHelpers.length).toBe(1);

		// Verify the goals were merged (preset amounts were added to existing)
		const storageAfterPreset = storage.load();
		const helperKey = Object.keys(storageAfterPreset.helpers).find(k =>
			k.startsWith('1041')); // Brilliant Diamond IDs start with 1041
		const mergedHelper = storageAfterPreset.helpers[helperKey];
		expect(mergedHelper).toBeDefined();

		// Should have preset goals (1 for tier one, 9 for tier two)
		expect(mergedHelper.tierOneGoal).toBe(1);
		expect(mergedHelper.tierTwoGoal).toBe(9);
	});

	test('should disable selector button after adding preset', async () => {
		// Test case: Add preset first, button should be disabled
		// 1. Add "Test Character" preset
		// 2. Verify button for Brilliant Diamond is disabled

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

		// Step 2: Check that the Brilliant Diamond button is disabled
		// The button should be disabled because the item is now in the helper list
		const itemSelector = document.querySelector('input[value="ASCENSION.104104"]');
		expect(itemSelector).toBeDefined();

		// The input should be disabled
		expect(itemSelector.disabled || itemSelector.hasAttribute('disabled')).toBe(true);
	});

	test('should not create duplicate helpers when adding same item after preset', async () => {
		// Test case: Add preset first, then try to add same item manually
		// 1. Add "Test Character" preset (includes Brilliant Diamond)
		// 2. Try to add Brilliant Diamond manually
		// Expected: Should not be possible (button disabled), no duplicate

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

		// Count helpers with Brilliant Diamond
		const allSectionsAfterPreset = document.querySelectorAll('section');
		const helpersAfterPreset = [...allSectionsAfterPreset].filter(section =>
			section.querySelector('button[title="Remove item"]'));

		const diamondHelpersBefore = helpersAfterPreset.filter(h => {
			const img = h.querySelector('img');
			return img && (img.alt.includes('Brilliant Diamond'));
		});

		expect(diamondHelpersBefore.length).toBe(1);

		// Step 2: Check button is disabled and count doesn't change
		const itemSelector = document.querySelector('input[value="ASCENSION.104104"]');
		expect(itemSelector.disabled || itemSelector.hasAttribute('disabled')).toBe(true);

		// Even if we somehow triggered it, it shouldn't create a duplicate
		// Verify storage only has one entry
		const storageState = storage.load();
		const diamondKeys = Object.keys(storageState.helpers).filter(key =>
			key.startsWith('1041')); // Brilliant Diamond IDs start with 1041

		expect(diamondKeys.length).toBe(1);
	});
});
