import {fireEvent, render, screen} from '@testing-library/react';
import {
	describe, expect, it, vi,
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
	it('renders without crashing', () => {
		const rendering = render(<Main/>);
		expect(rendering).toMatchSnapshot();
	});

	it('renders without crashing and all them buttons clicked', () => {
		global.innerWidth = 700;
		global.dispatchEvent(new Event('resize'));
		const rendering = render(<Main/>);

		// Add the first item
		const buttons = screen.getAllByTestId('image');
		fireEvent.click(buttons[0]);
		expect(rendering).toMatchSnapshot();

		const floatItems = screen.getByTitle('Click to float items');
		fireEvent.click(floatItems);
		expect(rendering).toMatchSnapshot();

		const stackItems = screen.getByTitle('Click to stack items');
		fireEvent.click(stackItems);
		expect(rendering).toMatchSnapshot();

		const removeButton = screen.getByTitle('Remove item');
		fireEvent.click(removeButton);
		expect(rendering).toMatchSnapshot();

		const fullScreenButton = screen.getByTitle('Make fullscreen');
		fireEvent.click(fullScreenButton);
		expect(rendering).toMatchSnapshot();

		// Screen does not actually go into fullscreen mode so there is no off case

		const wakeButton = screen.getByTitle('Keep screen awake');
		fireEvent.click(wakeButton);
		expect(rendering).toMatchSnapshot();

		// Screen does not actually go into wake mode so there is no off case
	});
});
