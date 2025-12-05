/* global localStorage */
import {
	act, fireEvent, render, screen,
} from '@testing-library/react';
import {
	beforeEach, describe, expect, test, vi,
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

	test('character preset adds materials with correct tier targets - Aino example', async () => {
		// Render the component
		const rendering = render(<Main/>);
		
		// Click the "Add Preset" button to open the modal
		const addPresetButton = screen.getByLabelText('Add preset');
		await act(() => {
			fireEvent.click(addPresetButton);
		});

		// Find and click the Aino character preset checkbox
		const ainoCheckbox = screen.getByLabelText('Aino');
		await act(() => {
			fireEvent.click(ainoCheckbox);
		});

		// Check that helpers were added
		const allSections = document.querySelectorAll('section');
		
		// Filter to farm helper sections (they contain material buttons)
		const helpers = Array.from(allSections).filter(section =>  {
			// Helper sections have remove buttons
			return section.querySelector('button[title="Remove item"]');
		});
		
		// Should have exactly 4 helpers:
		// 1. Portable Bearing (single tier)
		// 2. Varunada Lazurite (4 tiers combined: Sliver, Fragment, Chunk, Gemstone)
		// 3. Drive Shaft (3 tiers combined: Broken, Reinforced, Precision)
		// 4. Precision Kuuvahki Stamping Die (single tier)
		
		expect(helpers.length).toBe(4);
		
		// Debug: log what we got
		console.log(`Got ${helpers.length} helpers`);
		helpers.forEach((h, i) => {
			const img = h.querySelector('img');
			const imgAlt = img ? img.alt : 'no image';
			const tierButtons = h.querySelectorAll('[data-testid^="button-tier-"]');
			console.log(`Helper ${i}: ${imgAlt} (${tierButtons.length} tiers)`);
		});
		
		// Verify we have materials with correct tier counts
		// Portable Bearing: 1 tier
		const portableBearingHelper = helpers.find(h => {
			const img = h.querySelector('img');
			return img && img.alt.includes('Portable Bearing');
		});
		expect(portableBearingHelper).toBeDefined();
		const bearingTiers = portableBearingHelper.querySelectorAll('[data-testid^="button-tier-"]');
		expect(bearingTiers.length).toBe(1);
		
		// Varunada Lazurite: 4 tiers
		const varunadaHelper = helpers.find(h => {
			const img = h.querySelector('img');
			return img && img.alt.includes('Varunada Lazurite');
		});
		expect(varunadaHelper).toBeDefined();
		const varunadaTiers = varunadaHelper.querySelectorAll('[data-testid^="button-tier-"]');
		expect(varunadaTiers.length).toBe(4);
		
		// Drive Shaft: 3 tiers
		const driveShaftHelper = helpers.find(h => {
			const img = h.querySelector('img');
			return img && img.alt.includes('Drive Shaft');
		});
		expect(driveShaftHelper).toBeDefined();
		const driveShaftTiers = driveShaftHelper.querySelectorAll('[data-testid^="button-tier-"]');
		expect(driveShaftTiers.length).toBe(3);
		
		// Precision Kuuvahki Stamping Die: 1 tier
		const stampingDieHelper = helpers.find(h => {
			const img = h.querySelector('img');
			return img && img.alt.includes('Precision Kuuvahki Stamping Die');
		});
		expect(stampingDieHelper).toBeDefined();
		const stampingDieTiers = stampingDieHelper.querySelectorAll('[data-testid^="button-tier-"]');
		expect(stampingDieTiers.length).toBe(1);
	});
});
