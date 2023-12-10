import {fireEvent, render, screen} from '@testing-library/react';
import {describe, it, expect, vi} from 'vitest';

import ItemCategories from '../item-categories.jsx';
import {materials} from './mock-data.js';

const onChangeProp = vi.fn();

describe('ItemCategories', () => {
	it('renders the correct number of categories and handles click', () => {
		const rendering = render(<ItemCategories list={[]} materials={materials} onChangeProp={onChangeProp}/>);
		expect(rendering).toMatchSnapshot();

		const fieldsets = screen.getAllByRole('group');
		expect(fieldsets.length).toBe(8);

		fireEvent.click(fieldsets[0].querySelector('label'));

		expect(onChangeProp).toHaveBeenCalledTimes(1);
	});

	it('disables items that are already in the list', () => {
		const list = [
			'Philosophies of Freedom',
			'Scattered Piece of Decarabian\'s Dream',
			'Slime Concentrate',
			'Brilliant Diamond Gemstone',
			'Hurricane Seed',
			'Wolfhook',
			'Medaka',
			'Birch Wood',
			'Philosophies of Freedom',
			'Scattered Piece of Decarabian\'s Dream',
			'Slime Concentrate',
			'Brilliant Diamond Gemstone',
			'Hurricane Seed',
			'Wolfhook',
			'Medaka',
			'Birch Wood',
		];

		render(<ItemCategories list={list} materials={materials} onChangeProp={onChangeProp}/>);

		for (const item of list) {
			const element = screen.getByLabelText(item);
			expect(element).toBeDisabled();
		}
	});
});
