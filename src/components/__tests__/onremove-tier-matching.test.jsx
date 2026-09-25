import {
	beforeEach,
	describe,
	expect,
	test,
	vi,
} from 'vitest';
import {
	act,
	fireEvent,
	render,
	screen,
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

// Add a synthetic preset whose only tracked item is a building material.
// Building materials carry no `rarity` field in the upstream data shape, so
// this single-item preset exercises the "same rarity" grouping branch and
// falls through every other category check in `findMaterialCategory` before
// matching `buildingMaterials`.
vi.mock('presets', async () => {
	const {presets} = await vi.importActual('__tests__/__mocks__/presets.js');
	return {
		default: {
			...presets,
			characters: [
				...presets.characters,
				{
					id: 99_999,
					name: 'Test Building Preset',
					element: 'Geo',
					rarity: 4,
					items: [
						{
							id: 101_001,
							name: 'Iron Chunk',
							count: 5,
						},
					],
					images: {
						// eslint-disable-next-line camelcase
						filename_icon: 'UI_AvatarIcon_Test',
					},
				},
			],
		},
	};
});

describe('onRemove tier matching against active presets', () => {
	beforeEach(() => {
		const eventTarget = new EventTarget();
		const originalNavigator = navigator;
		vi.stubGlobal('navigator', {
			...originalNavigator,
			wakeLock: {
				request: vi.fn().mockResolvedValue({
					addEventListener: eventTarget.addEventListener.bind(eventTarget),
					dispatchEvent: eventTarget.dispatchEvent.bind(eventTarget),
					release: vi.fn(),
					released: 'hello',
				}),
			},
		});
	});

	test('removing a manually tracked material while presets are active exercises both tier-match branches', async () => {
		// "Test Character" (character.10000005) tracks materials 104101/104102,
		// which belong to the same 4-tier consecutive group as 104104 — checking
		// those preset items against the removed material exercises the
		// `tierIds.length > 1` branch of the tier-match ternary.
		// "Test Weapon" (weapon.11101) tracks material 114017, which has no
		// consecutive siblings in the mock data — checking that preset item
		// against the removed material exercises the `tierIds.length <= 1`
		// branch of the same ternary. Neither preset's tracked items are an
		// exact or tier-zero match for 104104, so both stay active afterwards.
		storage.save({
			helpers: {
				104_104: {
					category: 'ASCENSION',
					tierOne: 0,
					tierOneLock: false,
					tierTwo: 0,
					tierTwoLock: false,
					tierThree: 0,
					tierThreeLock: false,
					tierFour: 0,
					tierOneGoal: '',
					tierTwoGoal: '',
					tierThreeGoal: '',
					tierFourGoal: '',
				},
			},
			presets: ['character.10000005', 'weapon.11101'],
		});

		render(<Main/>);

		const removeButtons = screen.getAllByTitle('Remove item');
		expect(removeButtons).toHaveLength(1);

		await act(() => {
			fireEvent.click(removeButtons[0]);
		});

		const storageState = storage.load();
		expect(storageState.helpers['104104']).toBeUndefined();
		expect(storageState.presets).toEqual(['character.10000005', 'weapon.11101']);
	});

	test('adding a preset whose sole tracked item is a building material categorizes it correctly', async () => {
		storage.save({});
		render(<Main/>);

		const addPresetButton = screen.getByLabelText('Add preset');
		await act(() => {
			fireEvent.click(addPresetButton);
		});

		const buildingPresetCheckbox = screen.getByLabelText('Test Building Preset');
		await act(() => {
			fireEvent.click(buildingPresetCheckbox);
		});

		const storageState = storage.load();
		expect(storageState.helpers['101001']).toMatchObject({category: 'BUILDING'});
	});
});
