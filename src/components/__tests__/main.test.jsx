import {render} from '@testing-library/react';
import {describe, expect, it} from 'vitest';

import Main from '../main.jsx';

describe('Main', () => {
	it('renders without crashing', () => {
		const rendering = render(<Main/>);
		expect(rendering).toMatchSnapshot();
	});
});
