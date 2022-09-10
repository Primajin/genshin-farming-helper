import {render, screen} from '@testing-library/react';

import ItemPicker from '../item-picker.jsx';

const ballad = {
	name: 'Ballad',
	'2starname': 'Teachings of Ballad',
	'3starname': 'Guide to Ballad',
	'4starname': 'Philosophies of Ballad',
	day: ['Wednesday', 'Saturday', 'Sunday'],
	location: 'Springvale',
	region: 'Mondstadt',
	domainofmastery: 'Forsaken Rift',
	version: '',
};

const aerosiderite = {
	name: 'Aerosiderite',
	'2starname': 'Grain of Aerosiderite',
	'3starname': 'Piece of Aerosiderite',
	'4starname': 'Bit of Aerosiderite',
	'5starname': 'Chunk of Aerosiderite',
	day: ['Wednesday', 'Saturday', 'Sunday'],
	location: 'Mingyun Village',
	region: 'Liyue',
	domainofforgery: 'Hidden Palace of Lianshan Formula',
	version: '',
};

const slime = {
	name: 'Slime Concentrate',
	description: 'Concentrated slime essence. When left alone, it will begin to move on its own.',
	sortorder: 2313,
	rarity: '3',
	category: 'AVATAR_MATERIAL',
	materialtype: 'Character Level-Up Material',
	source: ['Crafted',		'Dropped by Lv. 60+ slimes'],
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

describe('ItemPicker', () => {
	// eslint-disable-next-line jest/expect-expect
	it('does not explode without props', () => {
		render(<ItemPicker/>);
	});

	it('renders with single element (weapon)', () => {
		render(<ItemPicker materials={[aerosiderite]} type='hello'/>);
		const label = screen.getByTitle('Aerosiderite');
		expect(label).toBeDefined();
		const backgroundStyle = label.querySelectorAll('div')[0].getAttribute('style');
		const regExp = /url\((\S+)\)/g;
		expect(regExp.exec(backgroundStyle)[1]).toBe('background_Item_5_Star.png');
	});

	it('renders with single element (char lvl)', () => {
		render(<ItemPicker materials={[slime]} type='hello'/>);
		const label = screen.getByTitle('Slime Concentrate');
		expect(label).toBeDefined();
		const backgroundStyle = label.querySelectorAll('div')[0].getAttribute('style');
		const regExp = /url\((\S+)\)/g;
		expect(regExp.exec(backgroundStyle)[1]).toBe('background_Item_3_Star.png');
	});

	it('renders with multiple elements', () => {
		render(<ItemPicker materials={[aerosiderite, ballad, slime]} type='hello'/>);
		const label1 = screen.getByTitle('Aerosiderite');
		const label2 = screen.getByTitle('Ballad');
		const label3 = screen.getByTitle('Slime Concentrate');
		expect(label1).toBeDefined();
		expect(label2).toBeDefined();
		expect(label3).toBeDefined();
		const backgroundStyle = label2.querySelectorAll('div')[0].getAttribute('style');
		const regExp = /url\((\S+)\)/g;
		expect(regExp.exec(backgroundStyle)[1]).toBe('background_Item_4_Star.png');
	});
});
