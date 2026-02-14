import {fireEvent, render, screen} from '@testing-library/react';
import {
	describe, test, expect, vi,
} from 'vitest';
import ItemCard from 'components/atoms/item-card.jsx';

describe('itemCard', () => {
	test('renders with name as title, alt text, and label', () => {
		render(<ItemCard name='Test Item' value='test.123' icon='icon_test'/>);
		const label = screen.getByTitle('Test Item');
		expect(label).toBeDefined();
		const image = screen.getByAltText('Test Item');
		expect(image).toBeDefined();
		expect(screen.getByText('Test Item')).toBeDefined();
	});

	test('renders radio input by default', () => {
		render(<ItemCard name='Test Item' value='test.123' icon='icon_test'/>);
		const input = screen.getByRole('radio');
		expect(input).toBeDefined();
		expect(input.getAttribute('name')).toBe('item');
		expect(input.getAttribute('value')).toBe('test.123');
	});

	test('renders checkbox input when type is checkbox', () => {
		render(<ItemCard name='Test Item' value='test.123' icon='icon_test' type='checkbox' inputName='preset'/>);
		const input = screen.getByRole('checkbox');
		expect(input).toBeDefined();
		expect(input.getAttribute('name')).toBe('preset');
	});

	test('renders background image based on rarity index', () => {
		render(<ItemCard name='Test Item' value='test.123' icon='icon_test' rarity={4}/>);
		const label = screen.getByTitle('Test Item');
		const backgroundStyle = label.querySelectorAll('div')[0].getAttribute('style');
		const regExp = /url\((\S+)\)/g;
		expect(regExp.exec(backgroundStyle)[1]).toContain('background_Item_5_Star.png');
	});

	test('falls back to alternative image URL on error', () => {
		render(<ItemCard name='Test Item' value='test.123' icon='icon_test'/>);
		const image = screen.getByTestId('image');
		const sourceBefore = image.getAttribute('src');
		expect(sourceBefore.includes('gi.yatta.moe')).toBeTruthy();
		fireEvent.error(image);
		const sourceAfter = image.getAttribute('src');
		expect(sourceAfter.includes('gi.yatta.moe')).toBeFalsy();
		expect(sourceAfter.includes('cloudinary.com')).toBeTruthy();
	});

	test('does not retry more than once on image error', () => {
		render(<ItemCard name='Test Item' value='test.123' icon='icon_test'/>);
		const image = screen.getByTestId('image');
		fireEvent.error(image);
		const sourceAfterFirst = image.getAttribute('src');
		fireEvent.error(image);
		const sourceAfterSecond = image.getAttribute('src');
		expect(sourceAfterFirst).toBe(sourceAfterSecond);
	});

	test('applies disabled state', () => {
		render(<ItemCard isDisabled name='Test Item' value='test.123' icon='icon_test'/>);
		const input = screen.getByRole('radio');
		expect(input).toBeDisabled();
		const label = screen.getByTitle('Test Item');
		expect(label.getAttribute('aria-disabled')).toBe('true');
	});

	test('applies checked state for checkbox', () => {
		render(<ItemCard isChecked isReadOnly name='Test Item' value='test.123' icon='icon_test' type='checkbox'/>);
		const input = screen.getByRole('checkbox');
		expect(input.checked).toBe(true);
	});

	test('forwards data-testid', () => {
		render(<ItemCard name='Test Item' value='test.123' icon='icon_test' data-testid='custom-id'/>);
		expect(screen.getByTestId('custom-id')).toBeDefined();
	});

	test('calls onClick when provided', () => {
		const handleClick = vi.fn();
		render(<ItemCard name='Test Item' value='test.123' icon='icon_test' onClick={handleClick}/>);
		const label = screen.getByTitle('Test Item');
		fireEvent.click(label);
		expect(handleClick).toHaveBeenCalled();
	});
});
