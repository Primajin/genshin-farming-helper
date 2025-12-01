import {fireEvent, render, screen} from '@testing-library/react';
import {
	describe, test, expect, vi,
} from 'vitest';

import ItemPicker from '../item-picker.jsx';
import {materialTypes} from '../../constants';

vi.mock('../../__tests__/__mocks__/data.js', async () => {
	const actual = await vi.importActual('../../__tests__/__mocks__/data.js');
	return actual;
});

const {materials} = await import('../../__tests__/__mocks__/data.js');

const philosophiesOfFreedom = materials.talentMaterials.find(material => material.id === 104_303);
const scatteredPieceOfDecarabiansDream = materials.weaponMaterials.find(material => material.id === 114_004);
const slimeConcentrate = materials.characterWeaponEnhancementMaterials.find(material => material.id === 112_004);

describe('itemPicker', () => {
	test('does not explode without props', () => {
		const rendering = render(<ItemPicker/>);
		expect(rendering).toMatchSnapshot();
	});

	test('renders with single element (weapon)', () => {
		render(<ItemPicker materials={[scatteredPieceOfDecarabiansDream]} type={materialTypes.WEAPON}/>);
		const label = screen.getByTitle('Scattered Piece of Decarabian\'s Dream');
		expect(label).toBeDefined();
		const backgroundStyle = label.querySelectorAll('div')[0].getAttribute('style');
		const regExp = /url\((\S+)\)/g;
		expect(regExp.exec(backgroundStyle)[1]).toBe('"/src/images/bg/background_Item_5_Star.png"');
	});

	test('renders with single element (char lvl)', () => {
		render(<ItemPicker materials={[slimeConcentrate]} type={materialTypes.LEVEL}/>);
		const label = screen.getByTitle('Slime Concentrate');
		expect(label).toBeDefined();
		const backgroundStyle = label.querySelectorAll('div')[0].getAttribute('style');
		const regExp = /url\((\S+)\)/g;
		expect(regExp.exec(backgroundStyle)[1]).toBe('"/src/images/bg/background_Item_3_Star.png"');
	});

	test('renders with multiple elements', () => {
		render(<ItemPicker materials={[scatteredPieceOfDecarabiansDream, philosophiesOfFreedom, slimeConcentrate]} type='hello'/>);
		const label1 = screen.getByTitle('Scattered Piece of Decarabian\'s Dream');
		const label2 = screen.getByTitle('Philosophies of Freedom');
		const label3 = screen.getByTitle('Slime Concentrate');
		expect(label1).toBeDefined();
		expect(label2).toBeDefined();
		expect(label3).toBeDefined();
		const backgroundStyle = label2.querySelectorAll('div')[0].getAttribute('style');
		const regExp = /url\((\S+)\)/g;
		expect(regExp.exec(backgroundStyle)[1]).toBe('"/src/images/bg/background_Item_4_Star.png"');
	});

	test('renders alternative image when initial one can not be loaded', () => {
		render(<ItemPicker materials={[scatteredPieceOfDecarabiansDream]} type={materialTypes.LEVEL}/>);
		const image = screen.getByTestId('image');
		expect(image).toBeDefined();
		const imageSourceBefore = image.getAttribute('src');
		expect(imageSourceBefore.includes('cloudinary.com')).toBeTruthy();
		fireEvent.error(image);
		const imageSourceAfter = image.getAttribute('src');
		expect(imageSourceAfter.includes('cloudinary.com')).toBeFalsy();
		expect(imageSourceAfter.includes('gi.yatta.moe')).toBeTruthy();
	});
});
