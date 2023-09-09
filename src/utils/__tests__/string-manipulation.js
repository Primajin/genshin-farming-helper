import {cleanName} from '../string-manipulation.js';

describe('stringManipulation', () => {
	describe('cleanName', () => {
		it('cleans up names', () => {
			const names = new Map([
				['Artificed Dynamic Gear', 'artificed_dynamic_gear'],
				['Artificed Spare Clockwork Component — Coppelia', 'artificed_spare_clockwork_component_coppelia'],
				['Emperor\'s Resolution', 'emperors_resolution'],
			]);

			for (const [name, expected] of names) {
				expect(cleanName(name)).toBe(expected);
			}
		});
	});
});
