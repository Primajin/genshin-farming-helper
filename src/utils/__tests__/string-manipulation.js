import {cleanName} from '../string-manipulation.js';

describe('stringManipulation', () => {
	describe('cleanName', () => {
		it('cleans up names', () => {
			const names = [
				{name: 'Artificed Dynamic Gear', expected: 'artificed_dynamic_gear'},
				{name: 'Artificed Spare Clockwork Component — Coppelia', expected: 'artificed_spare_clockwork_component_coppelia'},
				{name: 'Emperor\'s Resolution', expected: 'emperors_resolution'},
			];
			for (const {name, expected} of names) {
				expect(cleanName(name)).toBe(expected);
			}
		});
	});
});
