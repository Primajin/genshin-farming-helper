import {render, screen, fireEvent} from '@testing-library/react';
import {vi} from 'vitest';

import ActivePresets from '../active-presets';

test('renders active presets and handles removal', () => {
	const presets = [
		{name: 'Character 1', currentLevel: '1', targetLevel: '90'},
		{name: 'Weapon 1', currentLevel: '20', targetLevel: '80'},
	];
	const handleRemove = vi.fn();

	render(<ActivePresets presets={presets} onRemove={handleRemove}/>);

	expect(screen.getByText('Character 1 (1 to 90)')).toBeInTheDocument();
	expect(screen.getByText('Weapon 1 (20 to 80)')).toBeInTheDocument();

	const removeButtons = screen.getAllByRole('button');
	fireEvent.click(removeButtons[0]);

	expect(handleRemove).toHaveBeenCalledWith(presets[0]);
});
