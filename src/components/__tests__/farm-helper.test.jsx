import {fireEvent, render, screen} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';

import FarmHelper from '../farm-helper.jsx';
import {materialTypes} from '../../constants/index.js';
import {materials} from './mock-data.js';

const {
	ASCENSION, ENHANCEMENT, FISH, LEVEL, LOCAL, TALENT, WEAPON, WOOD,
} = materialTypes;

const materialMap = new Map([
	[ASCENSION, {name: 'Brilliant Diamond Gemstone', tiers: 4}],
	[ENHANCEMENT, {name: 'Slime Concentrate', tiers: 3}],
	[FISH, {name: 'Medaka', tiers: 1}],
	[LEVEL, {name: 'Dvalin\'s Plume', tiers: 1}],
	[LOCAL, {name: 'Wolfhook', tiers: 1}],
	[TALENT, {name: 'Philosophies of Freedom', tiers: 3}],
	[WEAPON, {name: 'Scattered Piece of Decarabian\'s Dream', tiers: 4}],
	[WOOD, {name: 'Birch Wood', tiers: 1}],
]);

const config = [0, false, 1, false, 2, false, 3];
const configWithLock = [0, false, 1, true, 2, false, 3];
const configWithLockPrefilled = [0, false, 4, true, 2, false, 3];
describe('FarmHelper', () => {
	for (const [category, {name, tiers}] of materialMap) {
		it(`renders correctly for ${category} ${name} with ${tiers} tiers`, () => {
			const mockRemove = vi.fn();
			render(<FarmHelper category={category} config={config} item={name} materials={materials} onRemove={mockRemove}/>);

			const buttons = screen.getAllByTestId(/button-tier-/);
			expect(buttons.length).toBe(tiers);
		});

		it(`increases counter correctly for ${category} ${name} on first tier`, () => {
			const mockRemove = vi.fn();
			render(<FarmHelper category={category} config={config} item={name} materials={materials} onRemove={mockRemove}/>);

			const buttons = screen.getAllByTestId(/button-tier-/);
			const valuesBefore = screen.getAllByTestId(/value-tier-/).map(element => element.textContent);

			switch (tiers) {
				case 1: {
					expect(valuesBefore).toMatchObject(['0']);
					break;
				}

				case 2: {
					expect(valuesBefore).toMatchObject(['0', '1']);
					break;
				}

				case 3: {
					expect(valuesBefore).toMatchObject(['0', '1', '2']);
					break;
				}

				default: {
					expect(valuesBefore).toMatchObject(['0', '1', '2', '3']);
					break;
				}
			}

			for (let i = 0; i < 9; i++) {
				fireEvent.click(buttons[0]);
			}

			const valuesAfter = screen.getAllByTestId(/value-tier-/).map(element => element.textContent);

			switch (tiers) {
				case 1: {
					expect(valuesAfter).toMatchObject(['9']);
					break;
				}

				case 2: {
					expect(valuesAfter).toMatchObject(['0', '4']);
					break;
				}

				case 3: {
					expect(valuesAfter).toMatchObject(['0', '1', '3']);
					break;
				}

				default: {
					expect(valuesAfter).toMatchObject(['0', '1', '0', '4']);
					break;
				}
			}
		});

		it(`increases counter correctly for ${category} ${name} when second tier is locked`, () => {
			const mockRemove = vi.fn();
			render(<FarmHelper category={category} config={configWithLock} item={name} materials={materials} onRemove={mockRemove}/>);

			const buttons = screen.getAllByTestId(/button-tier-/);
			const valuesBefore = screen.getAllByTestId(/value-tier-/).map(element => element.textContent);

			switch (tiers) {
				case 1: {
					expect(valuesBefore).toMatchObject(['0']);
					break;
				}

				case 2: {
					expect(valuesBefore).toMatchObject(['0', '1']);
					break;
				}

				case 3: {
					expect(valuesBefore).toMatchObject(['0', '1', '2']);
					break;
				}

				default: {
					expect(valuesBefore).toMatchObject(['0', '1', '2', '3']);
					break;
				}
			}

			for (let i = 0; i < 9; i++) {
				fireEvent.click(buttons[0]);
			}

			const valuesAfter = screen.getAllByTestId(/value-tier-/).map(element => element.textContent);

			switch (tiers) {
				case 1: {
					expect(valuesAfter).toMatchObject(['9']);
					break;
				}

				case 2: {
					expect(valuesAfter).toMatchObject(['0', '4']);
					break;
				}

				case 3: {
					expect(valuesAfter).toMatchObject(['0', '4', '2']);
					break;
				}

				default: {
					expect(valuesAfter).toMatchObject(['0', '4', '2', '3']);
					break;
				}
			}
		});

		if (tiers > 1) {
			it(`correctly tallies for ${category} ${name} when lock is lifted`, async () => {
				const mockRemove = vi.fn();
				render(<FarmHelper category={category} config={configWithLockPrefilled} item={name} materials={materials} onRemove={mockRemove}/>);

				const buttons = screen.getAllByTestId(/button-tier-/);
				const valuesBefore = screen.getAllByTestId(/value-tier-/).map(element => element.textContent);

				switch (tiers) {
					case 2: {
						expect(valuesBefore).toMatchObject(['0', '4']);
						break;
					}

					case 3: {
						expect(valuesBefore).toMatchObject(['0', '4', '2']);
						break;
					}

					default: {
						expect(valuesBefore).toMatchObject(['0', '4', '2', '3']);
						break;
					}
				}

				for (let i = 0; i < 9; i++) {
					fireEvent.click(buttons[0]);
				}

				const lock = screen.getByTestId('lock-tier-1');
				await fireEvent.click(lock.querySelector('input'));

				const valuesAfter = screen.getAllByTestId(/value-tier-/).map(element => element.textContent);

				switch (tiers) {
					case 2: {
						expect(valuesAfter).toMatchObject(['0', '4']);
						break;
					}

					case 3: {
						expect(valuesAfter).toMatchObject(['0', '1', '4']);
						break;
					}

					default: {
						expect(valuesAfter).toMatchObject(['0', '1', '1', '4']);
						break;
					}
				}
			});
		}
	}

	it('calls remove correctly when button is clicked', () => {
		const mockRemove = vi.fn();
		const {name} = materialMap.get(ASCENSION);

		render(<FarmHelper category={ASCENSION} config={config} item={name} materials={materials} onRemove={mockRemove}/>);

		const removeButton = screen.getByTitle('Remove item');
		fireEvent.click(removeButton);
		expect(mockRemove).toHaveBeenCalledTimes(1);
	});
});
