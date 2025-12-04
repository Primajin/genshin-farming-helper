import {render, screen, fireEvent} from '@testing-library/react';
import {
	describe, test, expect, vi,
} from 'vitest';

import PresetPicker from '../preset-picker';
import presets from '../../presets.json';

describe('PresetPicker', () => {
	const {characters, weapons, fishingRods} = presets;

	test('renders preset picker with characters tab active by default', () => {
		render(<PresetPicker onClose={() => {}} onAddPreset={() => {}}/>);
		expect(screen.getByText('Preset Picker')).toBeInTheDocument();
		expect(screen.getByText('Characters')).toHaveStyle('background-color: rgb(255, 255, 255)');
		expect(screen.getByText('Weapons')).toHaveStyle('background-color: #f1f1f1');
		expect(screen.getByText('Fishing Rods')).toHaveStyle('background-color: #f1f1f1');
		expect(screen.getByDisplayValue(characters[0])).toBeInTheDocument();
	});

	test('switches to weapons tab and updates dropdown', () => {
		render(<PresetPicker onClose={() => {}} onAddPreset={() => {}}/>);
		fireEvent.click(screen.getByText('Weapons'));
		expect(screen.getByText('Weapons')).toHaveStyle('background-color: rgb(255, 255, 255)');
		expect(screen.getByDisplayValue(weapons[0])).toBeInTheDocument();
	});

	test('switches to fishing rods tab and updates dropdown', () => {
		render(<PresetPicker onClose={() => {}} onAddPreset={() => {}}/>);
		fireEvent.click(screen.getByText('Fishing Rods'));
		expect(screen.getByText('Fishing Rods')).toHaveStyle('background-color: rgb(255, 255, 255)');
		expect(screen.getByDisplayValue(fishingRods[0].name)).toBeInTheDocument();
		expect(screen.queryByText('Current Level:')).not.toBeInTheDocument();
	});

	test('calls onAddPreset with correct character data when add button is clicked', () => {
		const onAddPreset = vi.fn();
		const onClose = vi.fn();
		render(<PresetPicker onClose={onClose} onAddPreset={onAddPreset}/>);

		fireEvent.change(screen.getByDisplayValue(characters[0]), {target: {value: characters[1]}});
		fireEvent.change(screen.getByLabelText(/Current Level:/), {target: {value: '20'}});
		fireEvent.change(screen.getByLabelText(/Target Level:/), {target: {value: '80'}});

		fireEvent.click(screen.getByRole('button', {name: 'Add'}));

		expect(onAddPreset).toHaveBeenCalledWith(expect.objectContaining({
			name: characters[1],
			currentLevel: '20',
			targetLevel: '80',
		}));
		expect(onClose).toHaveBeenCalled();
	});

	test('calls onAddPreset with correct fishing rod data when add button is clicked', () => {
		const onAddPreset = vi.fn();
		const onClose = vi.fn();
		render(<PresetPicker onClose={onClose} onAddPreset={onAddPreset}/>);

		fireEvent.click(screen.getByText('Fishing Rods'));
		fireEvent.change(screen.getByDisplayValue(fishingRods[0].name), {target: {value: fishingRods[1].name}});

		fireEvent.click(screen.getByRole('button', {name: 'Add'}));

		expect(onAddPreset).toHaveBeenCalledWith(expect.objectContaining({
			name: fishingRods[1].name,
			materials: expect.any(Array),
		}));
		expect(onClose).toHaveBeenCalled();
	});

	test('calls onClose when close button is clicked', () => {
		const onClose = vi.fn();
		render(<PresetPicker onClose={onClose} onAddPreset={() => {}}/>);
		fireEvent.click(screen.getByRole('button', {name: 'Close'}));
		expect(onClose).toHaveBeenCalled();
	});

	test('calls onClose when clicking on the backdrop', () => {
		const onClose = vi.fn();
		render(<PresetPicker onClose={onClose} onAddPreset={() => {}}/>);
		// The backdrop is the parent of the modal content
		fireEvent.click(screen.getByText('Preset Picker').parentElement.parentElement);
		expect(onClose).toHaveBeenCalled();
	});
});
