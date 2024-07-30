import {fireEvent, render, screen} from '@testing-library/react';
import {
	describe, it, expect, vi,
} from 'vitest';

import ItemCategories from '../item-categories.jsx';
import {materials} from '../../__tests__/__mocks__/data.js';

const onChangeProperty = vi.fn();

describe('ItemCategories', () => {
	it('renders the correct number of categories and handles click', () => {
		const rendering = render(<ItemCategories list={[]} materials={materials} onChangeProp={onChangeProperty}/>);
		expect(rendering).toMatchSnapshot();

		const fieldsets = screen.getAllByRole('group');
		expect(fieldsets.length).toBe(9);

		fireEvent.click(fieldsets[0].querySelector('label'));

		expect(onChangeProperty).toHaveBeenCalledTimes(1);
	});

	it('disables items that are already in the list', () => {
		const list = ['100021', '101301', '104104', '104303', '112004', '113001', '114004', '131000'];

		render(<ItemCategories list={list} materials={materials} onChangeProp={onChangeProperty}/>);

		for (const itemId of list) {
			const label = screen.getByTestId(`ItemPicker${itemId}`);
			expect(label.querySelector('input')).toBeDisabled();
		}
	});
});
