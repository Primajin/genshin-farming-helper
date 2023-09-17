import {fireEvent, render, screen} from '@testing-library/react';
import {describe, it, expect} from 'vitest';

import ItemPicker from '../item-picker.jsx';
import {materialTypes} from '../../constants';

const ballad = {
	name: 'Philosophies of Ballad',
	description: 'Talent Level-Up material.\nPoetry is the soul of the land of the wind.\nPoetry is the manifestations of the desire to spread the word. Though nothing is eternal, though nothing will be the same, the wind\'s poetry will still spread beyond the skies, the land, the seas to every corner of the world.',
	sortorder: 2224,
	rarity: '4',
	category: 'AVATAR_MATERIAL',
	materialtype: 'Talent Level-Up Material',
	dropdomain: 'Domain of Mastery: Realm of Slumber',
	daysofweek: [
		'Wednesday',
		'Saturday',
		'Sunday',
	],
	source: [
		'Crafted',
	],
	images: {
		redirect: 'https://genshin-impact.fandom.com/wiki/Special:Redirect/file/Item_Philosophies_of_Ballad.png',
		fandom: 'https://static.wikia.nocookie.net/gensin-impact/images/7/7e/Item_Philosophies_of_Ballad.png',
		nameicon: 'UI_ItemIcon_104309',
	},
	url: {
		fandom: 'https://genshin-impact.fandom.com/wiki/Philosophies_of_Ballad',
	},
	version: '',
};

const aerosiderite = {
	name: 'Chunk of Aerosiderite',
	description: 'Weapon Ascension Material.\nWhen Khaenri\'ah was destroyed, a great sinner created endless monsters with dark, alien blood flowing through their veins. They rampaged across the land, destroying all in their paths. They were mutated lifeforms, and the mutations were caused by powers from beyond this world. The black serpentine dragon Durin that attacked Mondstadt was one such mutated being.',
	sortorder: 2286,
	rarity: '5',
	category: 'AVATAR_MATERIAL',
	materialtype: 'Weapon Ascension Material',
	dropdomain: 'Domain of Forgery: Trial Grounds of Thunder',
	daysofweek: [
		'Wednesday',
		'Saturday',
		'Sunday',
	],
	source: [
		'Crafted',
	],
	images: {
		redirect: 'https://genshin-impact.fandom.com/wiki/Special:Redirect/file/Item_Chunk_of_Aerosiderite.png',
		fandom: 'https://static.wikia.nocookie.net/gensin-impact/images/4/48/Item_Chunk_of_Aerosiderite.png',
		nameicon: 'UI_ItemIcon_114024',
	},
	url: {
		fandom: 'https://genshin-impact.fandom.com/wiki/Chunk_of_Aerosiderite',
	},
	version: '',
};

const slime = {
	name: 'Slime Concentrate',
	description: 'Concentrated slime essence. When left alone, it will begin to move on its own.',
	sortorder: 2072,
	rarity: '3',
	category: 'AVATAR_MATERIAL',
	materialtype: 'Character Level-Up Material',
	source: [
		'Crafted',
		'Dropped by Lv. 60+ slimes',
	],
	images: {
		redirect: 'https://genshin-impact.fandom.com/wiki/Special:Redirect/file/Item_Slime_Concentrate.png',
		fandom: 'https://static.wikia.nocookie.net/gensin-impact/images/d/d8/Item_Slime_Concentrate.png',
		nameicon: 'UI_ItemIcon_112004',
	},
	url: {
		fandom: 'https://genshin-impact.fandom.com/wiki/Slime_Concentrate',
	},
	version: '',
};

const ancientChord = {
	name: 'Echo of an Ancient Chord',
	description: 'The God King\'s Grand Symphony is composed of countless melodies linked together, but its main thesis is submerged under the common destiny of the Water Nation.\nThe harmonies of those carefree years and sonatas were once the greatest representation of civilization and order, but when the prosperous empire descended into a playground for tyrants, the brutal despots tore the connection with the source asunder under the cover of golden cloaks, and discord finally swarmed through the empire—\nThe original song of fate continued to ring out on a score of fading gold, unperturbed by all... until all was dissolved, and all returned to chaos.',
	sortorder: 2984,
	rarity: '5',
	category: 'AVATAR_MATERIAL',
	materialtype: 'Weapon Ascension Material',
	dropdomain: 'Domain of Forgery: Robotic Ruse',
	daysofweek: [
		'Monday',
		'Thursday',
		'Sunday',
	],
	source: [
		'Crafted',
	],
	images: {
		nameicon: 'UI_ItemIcon_114052',
		redirect: 'https://genshin-impact.fandom.com/wiki/Special:Redirect/file/Item_Echo_of_an_Ancient_Chord.png',
	},
	version: '4.0',
};

describe('ItemPicker', () => {
	// eslint-disable-next-line vitest/expect-expect
	it('does not explode without props', () => {
		render(<ItemPicker/>);
	});

	it('renders with single element (weapon)', () => {
		render(<ItemPicker materials={[aerosiderite]} type={materialTypes.WEAPON}/>);
		const label = screen.getByTitle('Chunk of Aerosiderite');
		expect(label).toBeDefined();
		const backgroundStyle = label.querySelectorAll('div')[0].getAttribute('style');
		const regExp = /url\((\S+)\)/g;
		expect(regExp.exec(backgroundStyle)[1]).toBe('/genshin-farming-helper/src/images/bg/background_Item_5_Star.png');
	});

	it('renders with single element (char lvl)', () => {
		render(<ItemPicker materials={[slime]} type={materialTypes.LEVEL}/>);
		const label = screen.getByTitle('Slime Concentrate');
		expect(label).toBeDefined();
		const backgroundStyle = label.querySelectorAll('div')[0].getAttribute('style');
		const regExp = /url\((\S+)\)/g;
		expect(regExp.exec(backgroundStyle)[1]).toBe('/genshin-farming-helper/src/images/bg/background_Item_3_Star.png');
	});

	it('renders with multiple elements', () => {
		render(<ItemPicker materials={[aerosiderite, ballad, slime]} type='hello'/>);
		const label1 = screen.getByTitle('Chunk of Aerosiderite');
		const label2 = screen.getByTitle('Philosophies of Ballad');
		const label3 = screen.getByTitle('Slime Concentrate');
		expect(label1).toBeDefined();
		expect(label2).toBeDefined();
		expect(label3).toBeDefined();
		const backgroundStyle = label2.querySelectorAll('div')[0].getAttribute('style');
		const regExp = /url\((\S+)\)/g;
		expect(regExp.exec(backgroundStyle)[1]).toBe('/genshin-farming-helper/src/images/bg/background_Item_4_Star.png');
	});

	it('renders alternative image when initial one can not be loaded', () => {
		render(<ItemPicker materials={[ancientChord]} type={materialTypes.LEVEL}/>);
		const image = screen.getByTestId('image');
		expect(image).toBeDefined();
		const imageSourceBefore = image.getAttribute('src');
		expect(imageSourceBefore.includes('cloudinary.com')).toBeTruthy();
		fireEvent.error(image);
		const imageSourceAfter = image.getAttribute('src');
		expect(imageSourceAfter.includes('cloudinary.com')).toBeFalsy();
		expect(imageSourceAfter.includes('api.ambr.top')).toBeTruthy();
	});
});
