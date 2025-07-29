/* global navigator */
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

describe('main', () => {
	beforeEach(() => {
		const eventTarget = new EventTarget();
		const originalNavigator = navigator;
		globalThis.navigator = {
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
		globalThis.innerWidth = 700;
		globalThis.dispatchEvent(new Event('resize'));
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

		const removeButton = screen.getByTitle('Remove item');
		await act(() => {
			fireEvent.click(removeButton);
		});
		expect(rendering).toMatchSnapshot();

		const fullScreenButton = screen.getByTitle('Make fullscreen');
		await act(() => {
			fireEvent.click(fullScreenButton);
			globalThis.document.dispatchEvent(new Event('fullscreenchange'));
		});
		expect(rendering).toMatchSnapshot();

		const exitFullScreenButton = screen.getByTitle('Exit fullscreen');
		await act(() => {
			fireEvent.click(exitFullScreenButton);
			globalThis.document.dispatchEvent(new Event('fullscreenchange'));
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
});
