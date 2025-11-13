import fs from 'node:fs';
import genshinDb from 'genshin-db';

import {fishingRods} from './fishing-rods-data.js';

const isValidMaterial = material => material
	&& material.typeText
	&& material.category
	&& material.sortRank
	&& material.description
	&& material.name;

const defaultOptions = {matchCategories: true, verboseCategories: true};
const allMaterials = genshinDb.materials('names', defaultOptions).filter(material => isValidMaterial(material)).sort((a, b) => a.sortRank === b.sortRank ? a.id - b.id : a.sortRank - b.sortRank);

const characterAscensionMaterials = allMaterials.filter(material => material.typeText.startsWith('Character Ascension Material'));
const characterLVLMaterials = allMaterials.filter(material => material.typeText.startsWith('Character Level-Up Material') && !material.description.startsWith('Character Ascension'));
const characterWeaponEnhancementMaterials = allMaterials.filter(material => material.typeText.startsWith('Character and Weapon Enhancement Material'));
const fish = allMaterials.filter(material => material.typeText === 'Fish');
const localSpecialties = allMaterials.filter(material => material.typeText.startsWith('Local'));
const talentMaterials = allMaterials.filter(material => material.typeText.startsWith('Character Talent Material') && !material.name.startsWith('Crown of Insight'));
const weaponMaterials = allMaterials.filter(material => material.typeText.startsWith('Weapon Ascension Material'));
const wood = allMaterials.filter(material => material.category === 'WOOD');
const buildingMaterials = allMaterials.filter(material => material.sortRank === 301 || material.sortRank === 331);

export const materials = {
	buildingMaterials,
	characterAscensionMaterials,
	characterLVLMaterials,
	characterWeaponEnhancementMaterials,
	fish,
	localSpecialties,
	talentMaterials,
	weaponMaterials,
	wood,
};

fs.promises.writeFile('src/data.json', JSON.stringify(materials), error => {
	/* V8 ignore next 3 */
	if (error) {
		console.error(error);
	}
});

const talentMaterialsRare = materials.talentMaterials.filter(material => Number.parseInt(material.rarity, 10) > 3);
const weaponMaterialsRare = materials.weaponMaterials.filter(material => Number.parseInt(material.rarity, 10) > 4);
const characterAscensionMaterialsRare = materials.characterAscensionMaterials.filter(material => Number.parseInt(material.rarity, 10) > 4);
const characterWeaponEnhancementMaterialsRare = materials.characterWeaponEnhancementMaterials.filter(material => {
	const rarityInt = Number.parseInt(material.rarity, 10);
	const sortRankInt = Number.parseInt(material.sortRank, 10);
	return rarityInt > 2 ? (rarityInt === 3 ? !characterWeaponEnhancementMaterials.some(material => material.sortRank === sortRankInt && material.rarity > 3) : true) : false;
});

export const materialsRare = {
	buildingMaterials,
	characterAscensionMaterials: characterAscensionMaterialsRare,
	characterLVLMaterials,
	characterWeaponEnhancementMaterials: characterWeaponEnhancementMaterialsRare,
	fish,
	localSpecialties,
	talentMaterials: talentMaterialsRare,
	weaponMaterials: weaponMaterialsRare,
	wood,
};

fs.promises.writeFile('src/data-rare.json', JSON.stringify(materialsRare), error => {
	/* V8 ignore next 3 */
	if (error) {
		console.error(error);
	}
});

// Generate presets for characters and weapons
const aggregateMaterials = costs => {
	const items = {};

	for (const [, materials] of Object.entries(costs)) {
		for (const material of materials) {
			// Skip Mora
			if (material.name === 'Mora') {
				continue;
			}

			if (items[material.id]) {
				items[material.id].count += material.count;
			} else {
				items[material.id] = {
					id: material.id,
					name: material.name,
					count: material.count,
				};
			}
		}
	}

	return items;
};

const generatePresets = () => {
	const presets = {
		characters: [],
		weapons: [],
		fishingRods: [],
	};

	// Get all characters
	const characters = genshinDb.characters('names', defaultOptions);
	for (const character of characters) {
		if (!character?.costs) {
			continue;
		}

		const items = aggregateMaterials(character.costs);

		if (Object.keys(items).length > 0) {
			presets.characters.push({
				id: character.id,
				name: character.name,
				element: character.elementText,
				rarity: character.rarity,
				items: Object.values(items),
				images: character.images,
			});
		}
	}

	// Get all weapons
	const weapons = genshinDb.weapons('names', defaultOptions);
	for (const weapon of weapons) {
		if (!weapon?.costs) {
			continue;
		}

		const items = aggregateMaterials(weapon.costs);

		if (Object.keys(items).length > 0) {
			presets.weapons.push({
				id: weapon.id,
				name: weapon.name,
				weaponType: weapon.weaponText,
				rarity: weapon.rarity,
				items: Object.values(items),
				images: weapon.images,
			});
		}
	}

	// Get all fish materials for mapping
	const allFish = genshinDb.materials('names', defaultOptions).filter(m => m.typeText === 'Fish');

	// Process fishing rods
	for (const rod of fishingRods) {
		const items = [];

		for (const fishName of rod.fish) {
			const fishMaterial = allFish.find(f => f.name === fishName);
			if (fishMaterial) {
				items.push({
					id: fishMaterial.id,
					name: fishMaterial.name,
					count: 20, // Each fishing rod requires 20 of each fish
				});
			}
		}

		if (items.length > 0) {
			presets.fishingRods.push({
				id: rod.id,
				name: rod.name,
				items,
			});
		}
	}

	return presets;
};

const presets = generatePresets();
fs.promises.writeFile('src/presets.json', JSON.stringify(presets), error => {
	/* V8 ignore next 3 */
	if (error) {
		console.error(error);
	}
});
