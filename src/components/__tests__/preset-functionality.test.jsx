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

describe('preset functionality', () => {
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

	test('should add multiple character presets correctly', async () => {
		// Render the component
		render(<Main/>);

		// Click the "Add Preset" button to open the modal
		const addPresetButton = screen.getByLabelText('Add preset');
		await act(() => {
			fireEvent.click(addPresetButton);
		});

		// Add first character (Test Character)
		const testCharCheckbox = screen.getByLabelText('Test Character');
		await act(() => {
			fireEvent.click(testCharCheckbox);
		});

		// Add second character (Aino)
		const ainoCheckbox = screen.getByLabelText('Aino');
		await act(() => {
			fireEvent.click(ainoCheckbox);
		});

		// Verify both presets are active
		const storageState = storage.load();
		expect(storageState.presets).toContain('character.10000005');
		expect(storageState.presets).toContain('character.10000121');

		// Check that helpers were added
		const allSections = document.querySelectorAll('section');
		const helpers = [...allSections].filter(section =>
			section.querySelector('button[title="Remove item"]'));

		// Should have helpers from both characters
		expect(helpers.length).toBeGreaterThan(0);

		// Verify Test Character materials are present
		const brilliantDiamondHelper = helpers.find(h => {
			const img = h.querySelector('img');
			return img && img.alt.includes('Brilliant Diamond');
		});
		expect(brilliantDiamondHelper).toBeDefined();

		// Verify Aino materials are present
		const portableBearingHelper = helpers.find(h => {
			const img = h.querySelector('img');
			return img && img.alt.includes('Portable Bearing');
		});
		expect(portableBearingHelper).toBeDefined();
	});

	test('should add character and weapon presets correctly', async () => {
		// Render the component
		render(<Main/>);

		// Open preset modal
		const addPresetButton = screen.getByLabelText('Add preset');
		await act(() => {
			fireEvent.click(addPresetButton);
		});

		// Add a character preset
		const testCharCheckbox = screen.getByLabelText('Test Character');
		await act(() => {
			fireEvent.click(testCharCheckbox);
		});

		// Switch to weapons tab
		const weaponsTab = screen.getByText('Weapons');
		await act(() => {
			fireEvent.click(weaponsTab);
		});

		// Add a weapon preset
		const testWeaponCheckbox = screen.getByLabelText('Test Weapon');
		await act(() => {
			fireEvent.click(testWeaponCheckbox);
		});

		// Verify both presets are active
		const storageState = storage.load();
		expect(storageState.presets).toContain('character.10000005');
		expect(storageState.presets).toContain('weapon.11101');

		// Check that helpers from both were added
		const allSections = document.querySelectorAll('section');
		const helpers = [...allSections].filter(section =>
			section.querySelector('button[title="Remove item"]'));

		expect(helpers.length).toBeGreaterThan(0);

		// Verify character materials
		const brilliantDiamondHelper = helpers.find(h => {
			const img = h.querySelector('img');
			return img && img.alt.includes('Brilliant Diamond');
		});
		expect(brilliantDiamondHelper).toBeDefined();

		// Verify weapon materials
		const mistVeiledHelper = helpers.find(h => {
			const img = h.querySelector('img');
			return img && img.alt.includes('Mist Veiled');
		});
		expect(mistVeiledHelper).toBeDefined();
	});

	test('should add all fish species when adding fishing rod presets', async () => {
		// Render the component
		render(<Main/>);

		// Open preset modal
		const addPresetButton = screen.getByLabelText('Add preset');
		await act(() => {
			fireEvent.click(addPresetButton);
		});

		// Switch to fishing rods tab
		const fishingRodsTab = screen.getByText('Fishing Rods');
		await act(() => {
			fireEvent.click(fishingRodsTab);
		});

		// Add first fishing rod
		const rod1Checkbox = screen.getByLabelText('Test Fishing Rod 1');
		await act(() => {
			fireEvent.click(rod1Checkbox);
		});

		// Check that all fish species from this rod were added
		const allSections = document.querySelectorAll('section');
		let helpers = [...allSections].filter(section =>
			section.querySelector('button[title="Remove item"]'));

		// Rod 1 has 2 fish species: Common Axehead Fish and Veggie Mauler Shark
		expect(helpers.length).toBe(2);

		// Verify Common Axehead Fish
		let axeheadHelper = helpers.find(h => {
			const img = h.querySelector('img');
			return img && img.alt.includes('Common Axehead Fish');
		});
		expect(axeheadHelper).toBeDefined();

		// Verify Veggie Mauler Shark
		const maulerHelper = helpers.find(h => {
			const img = h.querySelector('img');
			return img && img.alt.includes('Veggie Mauler Shark');
		});
		expect(maulerHelper).toBeDefined();

		// Add second fishing rod (which shares Common Axehead Fish)
		const rod2Checkbox = screen.getByLabelText('Test Fishing Rod 2');
		await act(() => {
			fireEvent.click(rod2Checkbox);
		});

		// Re-check helpers
		const allSectionsAfter = document.querySelectorAll('section');
		helpers = [...allSectionsAfter].filter(section =>
			section.querySelector('button[title="Remove item"]'));

		// Should now have 3 unique fish species
		expect(helpers.length).toBe(3);

		// Verify Medaka was added
		const medakaHelper = helpers.find(h => {
			const img = h.querySelector('img');
			return img && img.alt.includes('Medaka');
		});
		expect(medakaHelper).toBeDefined();

		// Verify Common Axehead Fish goal was increased (overlapping item)
		axeheadHelper = helpers.find(h => {
			const img = h.querySelector('img');
			return img && img.alt.includes('Common Axehead Fish');
		});
		expect(axeheadHelper).toBeDefined();

		// Get the goal buttons for Common Axehead Fish
		const axeheadGoalButtons = axeheadHelper.querySelectorAll('[data-testid^="button-tier-"]');
		// Should have at least one tier button
		expect(axeheadGoalButtons.length).toBeGreaterThan(0);

		// The goal should be 40 (20 from rod 1 + 20 from rod 2)
		const storageState = storage.load();
		const axeheadItemId = '131046'; // Common Axehead Fish ID
		const axeheadHelper2 = storageState.helpers[axeheadItemId];
		expect(axeheadHelper2).toBeDefined();
		// Check that one of the tier goals is 40
		const hasGoal40 = axeheadHelper2.tierOneGoal === 40
			|| axeheadHelper2.tierTwoGoal === 40
			|| axeheadHelper2.tierThreeGoal === 40
			|| axeheadHelper2.tierFourGoal === 40;
		expect(hasGoal40).toBe(true);
	});

	test('should correctly subtract goals when removing presets', async () => {
		// Render the component
		render(<Main/>);

		// Open preset modal
		const addPresetButton = screen.getByLabelText('Add preset');
		await act(() => {
			fireEvent.click(addPresetButton);
		});

		// Add a character preset
		const testCharCheckbox = screen.getByLabelText('Test Character');
		await act(() => {
			fireEvent.click(testCharCheckbox);
		});

		// Verify it was added
		let storageState = storage.load();
		expect(storageState.presets).toContain('character.10000005');

		// Check that helpers were added
		let allSections = document.querySelectorAll('section');
		let helpers = [...allSections].filter(section =>
			section.querySelector('button[title="Remove item"]'));
		const helperCountBefore = helpers.length;
		expect(helperCountBefore).toBeGreaterThan(0);

		// Remove the preset by clicking it again
		await act(() => {
			fireEvent.click(testCharCheckbox);
		});

		// Verify it was removed
		storageState = storage.load();
		expect(storageState.presets).not.toContain('character.10000005');

		// Check that helpers were removed
		allSections = document.querySelectorAll('section');
		helpers = [...allSections].filter(section =>
			section.querySelector('button[title="Remove item"]'));
		expect(helpers.length).toBe(0);
	});

	test('should handle overlapping materials correctly when adding/removing presets', async () => {
		// Render the component
		render(<Main/>);

		// Open preset modal
		const addPresetButton = screen.getByLabelText('Add preset');
		await act(() => {
			fireEvent.click(addPresetButton);
		});

		// Switch to fishing rods tab (they share Common Axehead Fish)
		const fishingRodsTab = screen.getByText('Fishing Rods');
		await act(() => {
			fireEvent.click(fishingRodsTab);
		});

		// Add first fishing rod
		const rod1Checkbox = screen.getByLabelText('Test Fishing Rod 1');
		await act(() => {
			fireEvent.click(rod1Checkbox);
		});

		// Check initial goal for Common Axehead Fish
		let storageState = storage.load();
		const axeheadItemId = '131046';
		let axeheadHelper = storageState.helpers[axeheadItemId];
		expect(axeheadHelper).toBeDefined();
		let initialGoal = axeheadHelper.tierOneGoal || axeheadHelper.tierTwoGoal
			|| axeheadHelper.tierThreeGoal || axeheadHelper.tierFourGoal;
		expect(initialGoal).toBe(20);

		// Add second fishing rod (which also has Common Axehead Fish)
		const rod2Checkbox = screen.getByLabelText('Test Fishing Rod 2');
		await act(() => {
			fireEvent.click(rod2Checkbox);
		});

		// Check that goal was increased
		storageState = storage.load();
		axeheadHelper = storageState.helpers[axeheadItemId];
		expect(axeheadHelper).toBeDefined();
		let newGoal = axeheadHelper.tierOneGoal || axeheadHelper.tierTwoGoal
			|| axeheadHelper.tierThreeGoal || axeheadHelper.tierFourGoal;
		expect(newGoal).toBe(40);

		// Remove first fishing rod
		await act(() => {
			fireEvent.click(rod1Checkbox);
		});

		// Check that goal was decreased back to 20
		storageState = storage.load();
		axeheadHelper = storageState.helpers[axeheadItemId];
		expect(axeheadHelper).toBeDefined();
		newGoal = axeheadHelper.tierOneGoal || axeheadHelper.tierTwoGoal
			|| axeheadHelper.tierThreeGoal || axeheadHelper.tierFourGoal;
		expect(newGoal).toBe(20);

		// Remove second fishing rod
		await act(() => {
			fireEvent.click(rod2Checkbox);
		});

		// Check that Common Axehead Fish was completely removed
		storageState = storage.load();
		axeheadHelper = storageState.helpers[axeheadItemId];
		expect(axeheadHelper).toBeUndefined();
	});
});
