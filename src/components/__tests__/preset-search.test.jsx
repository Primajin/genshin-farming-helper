import {
	act, fireEvent, render, screen,
} from '@testing-library/react';
import {
	beforeEach, describe, test, expect, vi,
} from 'vitest';
import PresetModal from 'components/organisms/preset-modal.jsx';
import storage from 'utils/local-storage.js';

vi.mock('presets', async () => {
	const {presets} = await vi.importActual('__tests__/__mocks__/presets.js');
	return {
		default: {
			...presets,
		},
	};
});

describe('presetModal search', () => {
	beforeEach(() => {
		storage.save({});
	});

	test('renders the search input when modal is open', () => {
		render(<PresetModal isOpen activePresets={[]} onClose={vi.fn()} onPresetChange={vi.fn()}/>);
		expect(screen.getByRole('textbox', {name: 'Search presets'})).toBeDefined();
	});

	test('shows all presets when search term is empty', () => {
		render(<PresetModal isOpen activePresets={[]} onClose={vi.fn()} onPresetChange={vi.fn()}/>);
		expect(screen.getByTitle('Test Character')).toBeDefined();
		expect(screen.getByTitle('Aino')).toBeDefined();
	});

	test('filters presets by search term', () => {
		render(<PresetModal isOpen activePresets={[]} onClose={vi.fn()} onPresetChange={vi.fn()}/>);
		const searchInput = screen.getByRole('textbox', {name: 'Search presets'});

		fireEvent.change(searchInput, {target: {value: 'Aino'}});

		expect(screen.getByTitle('Aino')).toBeDefined();
		expect(screen.queryByTitle('Test Character')).toBeNull();
	});

	test('resets search term when switching tabs', async () => {
		render(<PresetModal isOpen activePresets={[]} onClose={vi.fn()} onPresetChange={vi.fn()}/>);
		const searchInput = screen.getByRole('textbox', {name: 'Search presets'});

		fireEvent.change(searchInput, {target: {value: 'Aino'}});
		expect(searchInput.value).toBe('Aino');

		const weaponsTab = screen.getByText('Weapons');
		await act(() => {
			fireEvent.click(weaponsTab);
		});

		expect(screen.getByRole('textbox', {name: 'Search presets'}).value).toBe('');
	});

	test('filters presets on weapons tab', async () => {
		render(<PresetModal isOpen activePresets={[]} onClose={vi.fn()} onPresetChange={vi.fn()}/>);

		const weaponsTab = screen.getByText('Weapons');
		await act(() => {
			fireEvent.click(weaponsTab);
		});

		const searchInput = screen.getByRole('textbox', {name: 'Search presets'});
		fireEvent.change(searchInput, {target: {value: 'Test Weapon'}});

		expect(screen.getByTitle('Test Weapon')).toBeDefined();
	});
});
