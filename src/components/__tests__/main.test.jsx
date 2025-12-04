
import {
	describe, it, expect, vi,
} from 'vitest';
import {
	render, screen, fireEvent, waitFor,
} from '@testing-library/react';

import Main from '../main';

vi.mock('genshin-db');

describe('main', () => {
	it('renders without crashing', () => {
		render(<Main/>);
	});

	it('renders without crashing and all them buttons clicked', async () => {
		render(<Main/>);
		fireEvent.click(screen.getByTitle('Make fullscreen'));
		fireEvent.click(screen.getByTitle('Make fullscreen'));
		fireEvent.click(screen.getByTitle('Open Preset Picker'));
		await screen.findByTitle('Close');
		fireEvent.click(screen.getByTitle('Close'));
		fireEvent.click(screen.getByTitle('Click to float items'));
		fireEvent.click(screen.getByTitle('Unfloat items'));
		fireEvent.click(screen.getByTitle('Keep screen awake'));
		fireEvent.click(screen.getByTitle('Allow screen to sleep'));
	});
});
