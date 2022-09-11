import {breakpoints, deviceSpecs, forDevice, up} from '../theming.js';

describe('theming', () => {
	describe('up', () => {
		it('gets media query for given breakpoint', () => {
			for (const [key, value] of breakpoints.entries()) {
				expect(up(key)).toBe(`@media (min-width: ${value}px)`);
			}
		});

		it('gets media query for custom breakpoint', () => {
			expect(up(123)).toBe('@media (min-width: 123px)');
			expect(up('123')).toBe('@media (min-width: 123px)');
		});
	});

	describe('forDevice', () => {
		it('gets media query for given breakpoint', () => {
			for (const [key, value] of deviceSpecs.entries()) {
				expect(forDevice(key)).toBe(`@media (hover: ${value[0]}) and (pointer: ${value[1]})`);
			}
		});
	});
});
