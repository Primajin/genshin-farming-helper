import {fireEvent, render, screen} from '@testing-library/react';
import {
	describe, expect, test, vi,
} from 'vitest';
import PresetGrid from 'components/molecules/preset-grid.jsx';

const presets = [
	{
		id: 1,
		name: 'Test Character',
		rarity: 5,
		images: {
			// eslint-disable-next-line camelcase
			filename_icon: 'UI_AvatarIcon_Test',
		},
	},
	{
		id: 2,
		name: 'Another Character',
		rarity: 4,
		images: {
			// eslint-disable-next-line camelcase
			filename_icon: 'UI_AvatarIcon_Other',
		},
	},
];

describe('presetGrid', () => {
	test('renders all preset cards', () => {
		render(<PresetGrid activePresets={[]} presets={presets} type='character' onPresetClick={vi.fn()}/>);
		expect(screen.getByTitle('Test Character')).toBeDefined();
		expect(screen.getByTitle('Another Character')).toBeDefined();
	});

	test('marks active presets as checked', () => {
		render(<PresetGrid activePresets={['character.1']} presets={presets} type='character' onPresetClick={vi.fn()}/>);
		const checkboxes = screen.getAllByRole('checkbox');
		expect(checkboxes[0].checked).toBe(true);
		expect(checkboxes[1].checked).toBe(false);
	});

	test('calls onPresetClick with synthetic event on click', () => {
		const handleClick = vi.fn();
		render(<PresetGrid activePresets={[]} presets={presets} type='character' onPresetClick={handleClick}/>);
		const label = screen.getByTitle('Test Character');
		fireEvent.click(label);
		expect(handleClick).toHaveBeenCalledWith({target: {value: 'character.1'}});
	});

	test('prevents default on click to avoid checkbox toggle', () => {
		render(<PresetGrid activePresets={[]} presets={presets} type='character' onPresetClick={vi.fn()}/>);
		const checkbox = screen.getAllByRole('checkbox')[0];
		// Checkbox should remain unchecked because handleClick calls preventDefault
		fireEvent.click(screen.getByTitle('Test Character'));
		expect(checkbox.checked).toBe(false);
	});

	test('uses correct preset ID format with type prefix', () => {
		const handleClick = vi.fn();
		render(<PresetGrid activePresets={[]} presets={presets} type='weapon' onPresetClick={handleClick}/>);
		const label = screen.getByTitle('Test Character');
		fireEvent.click(label);
		expect(handleClick).toHaveBeenCalledWith({target: {value: 'weapon.1'}});
	});
});
