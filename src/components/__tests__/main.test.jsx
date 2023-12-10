import {render} from '@testing-library/react';
import {describe, it} from 'vitest';

import Main from '../main.jsx';

describe('ItemCategories', () => {
	// eslint-disable-next-line vitest/expect-expect
	it('renders without crashing', () => {
		render(<Main/>);
	});
});
