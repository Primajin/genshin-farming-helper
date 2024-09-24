import {fireEvent, render, screen} from '@testing-library/react';
import {
	describe, expect, it, vi,
} from 'vitest';

import FarmHelper from '../farm-helper.jsx';
import {materialTypes} from '../../constants/index.js';
import {materials} from '../../__tests__/__mocks__/data.js';

const {
	ASCENSION,
	BUILDING,
	ENHANCEMENT,
	FISH,
	LEVEL,
	LOCAL,
	TALENT,
	WEAPON,
	WOOD,
} = materialTypes;

const materialMap = new Map([
	[ASCENSION, {id: 104_104, name: 'Brilliant Diamond Gemstone', tiers: 4}],
	[BUILDING, {id: 101_001, name: 'Iron Chunk', tiers: 1}],
	[ENHANCEMENT, {id: 112_004, name: 'Slime Concentrate', tiers: 3}],
	[FISH, {id: 131_000, name: 'Medaka', tiers: 1}],
	[LEVEL, {id: 113_003, name: 'Dvalin\'s Plume', tiers: 1}],
	[LOCAL, {id: 100_021, name: 'Wolfhook', tiers: 1}],
	[TALENT, {id: 104_303, name: 'Philosophies of Freedom', tiers: 3}],
	[WEAPON, {id: 114_004, name: 'Scattered Piece of Decarabian\'s Dream', tiers: 4}],
	[WOOD, {id: 101_301, name: 'Birch Wood', tiers: 1}],
]);

const config = {
	tierOne: 0,
	tierOneLock: false,
	tierTwo: 1,
	tierTwoLock: false,
	tierThree: 2,
	tierThreeLock: false,
	tierFour: 3,
};
const configWithLock = {
	tierOne: 0,
	tierOneLock: false,
	tierTwo: 1,
	tierTwoLock: true,
	tierThree: 2,
	tierThreeLock: false,
	tierFour: 3,
};
const configWithLockPrefilled = {
	tierOne: 0,
	tierOneLock: false,
	tierTwo: 4,
	tierTwoLock: true,
	tierThree: 2,
	tierThreeLock: false,
	tierFour: 3,
};
const configWithTargetsSet = {
	tierOne: 1,
	tierOneLock: false,
	tierTwo: 2,
	tierTwoLock: true,
	tierThree: 3,
	tierThreeLock: true,
	tierFour: 4,
	tierOneGoal: '',
	tierTwoGoal: '',
	tierThreeGoal: 3,
	tierFourGoal: 5,
};

const globalMockRemove = vi.fn();
describe('farmHelper', () => {
	for (const [category, {id, name, tiers}] of materialMap) {
		it(`renders correctly for ${category} ${name} with ${tiers} tiers`, () => {
			const rendering = render(<FarmHelper category={category} config={config} itemId={id.toString()} materials={materials} onRemove={globalMockRemove}/>);
			expect(rendering).toMatchSnapshot();

			const buttons = screen.getAllByTestId(/button-tier-/);
			expect(buttons).toHaveLength(tiers);
		});

		it(`increases counter correctly for ${category} ${name} on first tier`, () => {
			render(<FarmHelper category={category} config={config} itemId={id.toString()} materials={materials} onRemove={globalMockRemove}/>);

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
			render(<FarmHelper category={category} config={configWithLock} itemId={id.toString()} materials={materials} onRemove={globalMockRemove}/>);

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
				render(<FarmHelper category={category} config={configWithLockPrefilled} itemId={id.toString()} materials={materials} onRemove={globalMockRemove}/>);

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

		if (tiers > 3) {
			it(`correctly shows targets for ${category} ${name} when they are set`, async () => {
				render(<FarmHelper category={category} config={configWithTargetsSet} itemId={id.toString()} materials={materials} onRemove={globalMockRemove}/>);

				const buttons = screen.getAllByTestId(/button-tier-/);
				const lastButton = buttons.at(-1);
				expect(lastButton.getAttribute('title')).toMatch(/1.+remaining/);
			});
		}
	}

	it('increases correctly if every button was clicked sequentially', () => {
		const {id} = materialMap.get(ASCENSION);

		render(<FarmHelper category={ASCENSION} config={config} itemId={id.toString()} materials={materials} onRemove={globalMockRemove}/>);

		const buttons = screen.getAllByTestId(/button-tier-/);
		const valuesBefore = screen.getAllByTestId(/value-tier-/).map(element => element.textContent);

		for (let i = 0; i < 4; i++) {
			fireEvent.click(buttons[i]);
		}

		const valuesAfter = screen.getAllByTestId(/value-tier-/).map(element => element.textContent);

		expect(valuesBefore).toMatchObject(['0', '1', '2', '3']);
		expect(valuesAfter).toMatchObject(['1', '2', '0', '5']);
	});

	it('sets a goal and changes to green when goal is reached', () => {
		const {id} = materialMap.get(ASCENSION);

		render(<FarmHelper category={ASCENSION} config={config} itemId={id.toString()} materials={materials} onRemove={globalMockRemove}/>);

		const goalLabels = screen.getAllByTestId('goal-label');
		const buttons = screen.getAllByTestId(/button-tier-/);
		const valuesBefore = buttons.map(button => button.querySelector('b'));

		for (const className of valuesBefore.map(value => value.className)) {
			expect(className).toBe('css-0');
		}

		// Currently the values are     0, 1, 2, 3
		// and the goals will be set to 0, 1, 2, 3
		for (let i = 0; i < 4; i++) {
			const input = goalLabels[i].querySelector('input');
			fireEvent.change(input, {target: {value: `${i}`}});
		}

		// Now everything will be increased by one
		for (let i = 0; i < 4; i++) {
			fireEvent.click(buttons[i]);
		}
		// The values are now         1, 2, 0, 5
		// so the goals will match on the second and the last item

		const valuesAfter = buttons.map(button => button.querySelector('b'));

		for (const [index, className] of valuesAfter.map(value => value.className).entries()) {
			if (index % 2) {
				expect(className).not.toBe('css-0');
			} else {
				expect(className).toBe('css-0');
			}
		}
	});

	it('removes a goal and changes back to grey when goal is removed', () => {
		const {id} = materialMap.get(ASCENSION);

		render(<FarmHelper category={ASCENSION} config={config} itemId={id.toString()} materials={materials} onRemove={globalMockRemove}/>);

		const goalLabels = screen.getAllByTestId('goal-label');
		const buttons = screen.getAllByTestId(/button-tier-/);
		const valuesBefore = buttons.map(button => button.querySelector('b'));

		for (const className of valuesBefore.map(value => value.className)) {
			expect(className).toBe('css-0');
		}

		// Currently the values are     0, 1, 2, 3
		// and the goals will be set to 0, 1, 2, 3
		for (let i = 0; i < 4; i++) {
			const input = goalLabels[i].querySelector('input');
			fireEvent.change(input, {target: {value: `${i}`}});
		}

		// Now everything will be increased by one
		for (let i = 0; i < 4; i++) {
			fireEvent.click(buttons[i]);
		}
		// Until here is what was tested in the test before

		// Now we remove all the goals again
		for (let i = 0; i < 4; i++) {
			const input = goalLabels[i].querySelector('input');
			fireEvent.change(input, {target: {value: '0'}});
		}

		const valuesAfter = buttons.map(button => button.querySelector('b'));
		for (const className of valuesAfter.map(value => value.className)) {
			expect(className).toBe('css-0');
		}

		// We also test if it handles backspace (= sending empty string)
		for (let i = 0; i < 4; i++) {
			const input = goalLabels[i].querySelector('input');
			fireEvent.change(input, {target: {value: ''}});
		}

		for (const className of valuesAfter.map(value => value.className)) {
			expect(className).toBe('css-0');
		}
	});

	it('calls remove correctly when button is clicked', () => {
		const mockRemove = vi.fn();
		const {id} = materialMap.get(ASCENSION);

		render(<FarmHelper category={ASCENSION} config={config} itemId={id.toString()} materials={materials} onRemove={mockRemove}/>);

		const removeButton = screen.getByTitle('Remove item');
		fireEvent.click(removeButton);
		expect(mockRemove).toHaveBeenCalledTimes(1);
	});
});
