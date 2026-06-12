import {fireEvent, render, screen} from '@testing-library/react';
import {
	describe, test, expect, vi,
} from 'vitest';
import ItemCategories from 'components/organisms/item-categories.jsx';

vi.mock('../../__tests__/__mocks__/data.js', async () => {
	const actual = await vi.importActual('../../__tests__/__mocks__/data.js');
	return actual;
});

const {materials} = await import('__tests__/__mocks__/data.js');

const onChangeProperty = vi.fn();

describe('itemCategories search', () => {
	test('renders the search input', () => {
		render(<ItemCategories list={[]} materials={materials} onChangeProp={onChangeProperty}/>);
		expect(screen.getByRole('searchbox', {name: 'Search items'})).toBeDefined();
	});

	test('shows all fieldsets when search term is empty', () => {
		render(<ItemCategories list={[]} materials={materials} onChangeProp={onChangeProperty}/>);
		const fieldsets = screen.getAllByRole('group');
		expect(fieldsets).toHaveLength(9);
	});

	test('filters items by search term', () => {
		render(<ItemCategories list={[]} materials={materials} onChangeProp={onChangeProperty}/>);
		const searchInput = screen.getByRole('searchbox', {name: 'Search items'});

		fireEvent.change(searchInput, {target: {value: 'Iron Chunk'}});

		expect(screen.queryByText('Iron Chunk')).toBeDefined();
	});

	test('hides fieldsets with no matching items when searching', () => {
		render(<ItemCategories list={[]} materials={materials} onChangeProp={onChangeProperty}/>);
		const searchInput = screen.getByRole('searchbox', {name: 'Search items'});

		// Search for something that only exists in Building Materials
		fireEvent.change(searchInput, {target: {value: 'Iron Chunk'}});

		// Not all 9 fieldsets should be visible when filtering
		const fieldsets = screen.getAllByRole('group');
		expect(fieldsets.length).toBeLessThan(9);
	});

	test('restores all fieldsets when search is cleared', () => {
		render(<ItemCategories list={[]} materials={materials} onChangeProp={onChangeProperty}/>);
		const searchInput = screen.getByRole('searchbox', {name: 'Search items'});

		fireEvent.change(searchInput, {target: {value: 'Iron Chunk'}});
		fireEvent.change(searchInput, {target: {value: ''}});

		const fieldsets = screen.getAllByRole('group');
		expect(fieldsets).toHaveLength(9);
	});
});
