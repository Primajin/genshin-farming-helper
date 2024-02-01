import {render} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';

import Main from '../main.jsx';

vi.mock('../../data.json', async () => {
	const {materials} = await vi.importActual('./mock-data.js');
	return {
		default: {
			...materials,
		},
	};
});

vi.mock('../../data-rare.json', async () => {
	const {materialsRare} = await vi.importActual('./mock-data.js');
	return {
		default: {
			...materialsRare,
		},
	};
});

describe('Main', () => {
	it('renders without crashing', () => {
		const rendering = render(<Main/>);
		expect(rendering).toMatchSnapshot();
	});
});
