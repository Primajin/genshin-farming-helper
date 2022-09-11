import rarity1 from '../images/bg/background_Item_1_Star.png';
import rarity2 from '../images/bg/background_Item_2_Star.png';
import rarity3 from '../images/bg/background_Item_3_Star.png';
import rarity4 from '../images/bg/background_Item_4_Star.png';
import rarity5 from '../images/bg/background_Item_5_Star.png';

export const backgrounds = [rarity1, rarity2, rarity3, rarity4, rarity5];

export const materialTypes = {
	TALENT: 'TALENT',
	WEAPON: 'WEAPON',
	LEVEL: 'LEVEL',
	ASCENSION: 'ASCENSION',
};

export const nameKeys = ['2starname', '3starname', '4starname', '5starname'];

export const IMG_URL = 'https://res.cloudinary.com/genshin/image/upload/sprites/';

/* Temp */
export const commonDrops = [
	'Slime Condensate',
	'Slime Secretions',
	'Slime Concentrate',
	'Damaged Mask',
	'Stained Mask',
	'Ominous Mask',
	'Divining Scroll',
	'Sealed Scroll',
	'Forbidden Curse Scroll',
	'Firm Arrowhead',
	'Sharp Arrowhead',
	'Weathered Arrowhead',
	'Recruit\'s Insignia',
	'Sergeant\'s Insignia',
	'Lieutenant\'s Insignia',
	'Treasure Hoarder Insignia',
	'Silver Raven Insignia',
	'Golden Raven Insignia',
	'Whopperflower Nectar',
	'Shimmering Nectar',
	'Energy Nectar',
	'Old Handguard',
	'Kageuchi Handguard',
	'Famed Handguard',
	'Spectral Husk',
	'Spectral Heart',
	'Spectral Nucleus',
	'Fungal Spores',
	'Luminescent Pollen',
	'Crystalline Cyst Dust',
	'Faded Red Satin',
	'Trimmed Red Silk',
	'Rich Red Brocade',
];

const eliteDrops = [
	'Heavy Horn',
	'Black Bronze Horn',
	'Black Crystal Horn',
	'Dead Ley Line Branch',
	'Dead Ley Line Leaves',
	'Ley Line Sprout',
	'Chaos Device',
	'Chaos Circuit',
	'Chaos Core',
	'Mist Grass Pollen',
	'Mist Grass',
	'Mist Grass Wick',
	'Hunter\'s Sacrificial Knife',
	'Agent\'s Sacrificial Knife',
	'Inspector\'s Sacrificial Knife',
	'Fragile Bone Shard',
	'Sturdy Bone Shard',
	'Fossilized Bone Shard',
	'Chaos Gear',
	'Chaos Axis',
	'Chaos Oculus',
	'Dismal Prism',
	'Crystal Prism',
	'Polarizing Prism',
	'Concealed Claw',
	'Concealed Unguis',
	'Concealed Talon',
	'Gloomy Statuette',
	'Dark Statuette',
	'Deathly Statuette',
	'Inactivated Fungal Nucleus',
	'Dormant Fungal Nucleus',
	'Robust Fungal Nucleus',
	'Chaos Storage',
	'Chaos Module',
	'Chaos Bolt',
];

export const drops = [...commonDrops, ...eliteDrops];
