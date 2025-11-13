/* global localStorage */
import {
	act, fireEvent, render, screen,
} from '@testing-library/react';
import {
	beforeEach, describe, expect, test, vi,
} from 'vitest';

import Main from '../main.jsx';

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

vi.mock('../../presets.json', async () => {
	const {presets} = await vi.importActual('../../__tests__/__mocks__/presets.js');
	return {
		default: {
			...presets,
		},
	};
});

describe('main', () => {
	beforeEach(() => {
		// Clear localStorage before each test
		localStorage.clear();

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
	});

	test('renders without crashing', () => {
		const rendering = render(<Main/>);
		expect(rendering).toMatchSnapshot();
	});

	test('renders without crashing and all them buttons clicked', async () => {
		global.innerWidth = 700;
		global.dispatchEvent(new Event('resize'));
		const rendering = render(<Main/>);

		// Add the first item
		const buttons = screen.getAllByTestId('image');
		await act(() => {
			fireEvent.click(buttons[0]);
		});
		expect(rendering).toMatchSnapshot();

		const floatItems = screen.getByTitle('Click to float items');
		await act(() => {
			fireEvent.click(floatItems);
		});
		expect(rendering).toMatchSnapshot();

		const stackItems = screen.getByTitle('Click to stack items');
		await act(() => {
			fireEvent.click(stackItems);
		});
		expect(rendering).toMatchSnapshot();

		const removeButton = screen.getAllByTitle('Remove item')[0];
		await act(() => {
			fireEvent.click(removeButton);
		});
		expect(rendering).toMatchSnapshot();

		const fullScreenButton = screen.getByTitle('Make fullscreen');
		await act(() => {
			fireEvent.click(fullScreenButton);
			global.document.dispatchEvent(new Event('fullscreenchange'));
		});
		expect(rendering).toMatchSnapshot();

		const exitFullScreenButton = screen.getByTitle('Exit fullscreen');
		await act(() => {
			fireEvent.click(exitFullScreenButton);
			global.document.dispatchEvent(new Event('fullscreenchange'));
		});
		expect(rendering).toMatchSnapshot();

		const wakeButton = screen.getByTitle('Keep screen awake');
		await act(() => {
			fireEvent.click(wakeButton);
		});
		expect(rendering).toMatchSnapshot();

		const sleepButton = screen.getByTitle('Allow screen to sleep');
		await act(() => {
			fireEvent.click(sleepButton);
		});
		expect(rendering).toMatchSnapshot();
	});

	test('fishing rod presets tally correctly when multiple rods are selected', async () => {
		const rendering = render(<Main/>);

		// Get fishing rod preset labels by their data-testid
		const fishingRodLabel1 = screen.getByTestId('PresetPickerfishingRod.201001');
		const fishingRodLabel2 = screen.getByTestId('PresetPickerfishingRod.201002');

		// Click the first fishing rod preset label
		await act(() => {
			fireEvent.click(fishingRodLabel1);
		});

		// Get the storage after first preset
		const storageState1 = JSON.parse(localStorage.getItem('genshin-farming-helper'));
		const helpers1 = storageState1?.helpers ?? {};
		const fishId1 = '131046'; // Common Axehead Fish from test data (shared between both rods)
		const fishId2 = '131047'; // Veggie Mauler Shark from rod 1 only

		// Verify that the fish items are added with count 20 each
		expect(helpers1[fishId1]).toBeDefined();
		expect(helpers1[fishId1].tierOneGoal).toBe(20);
		expect(helpers1[fishId2]).toBeDefined();
		expect(helpers1[fishId2].tierOneGoal).toBe(20);

		// Click the second fishing rod preset (should tally with first)
		await act(() => {
			fireEvent.click(fishingRodLabel2);
		});

		const storageState2 = JSON.parse(localStorage.getItem('genshin-farming-helper'));
		const helpers2 = storageState2?.helpers ?? {};
		const fishId3 = '131048'; // Medaka from rod 2 only

		// Verify the shared fish (Common Axehead) is tallied to 40 (20 + 20)
		expect(helpers2[fishId1]).toBeDefined();
		expect(helpers2[fishId1].tierOneGoal).toBe(40);

		// Verify fish unique to rod 1 still has 20
		expect(helpers2[fishId2]).toBeDefined();
		expect(helpers2[fishId2].tierOneGoal).toBe(20);

		// Verify fish unique to rod 2 is added with 20
		expect(helpers2[fishId3]).toBeDefined();
		expect(helpers2[fishId3].tierOneGoal).toBe(20);

		// Click the first fishing rod preset again to remove it
		await act(() => {
			fireEvent.click(fishingRodLabel1);
		});

		const storageState3 = JSON.parse(localStorage.getItem('genshin-farming-helper'));
		const helpers3 = storageState3?.helpers ?? {};

		// Verify the shared fish (Common Axehead) is back to 20 (only rod 2)
		expect(helpers3[fishId1]).toBeDefined();
		expect(helpers3[fishId1].tierOneGoal).toBe(20);

		// Verify fish unique to rod 1 is removed
		expect(helpers3[fishId2]).toBeUndefined();

		// Verify fish unique to rod 2 still has 20
		expect(helpers3[fishId3]).toBeDefined();
		expect(helpers3[fishId3].tierOneGoal).toBe(20);

		expect(rendering).toMatchSnapshot();
	});
});
