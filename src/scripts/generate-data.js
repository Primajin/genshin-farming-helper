import fs from 'node:fs';
import genshinDb from 'genshin-db';

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
const fishingRods = allMaterials.filter(material => material.category === 'FISH_ROD');

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

const characters = genshinDb.characters('names', {matchCategories: true});
const weapons = genshinDb.weapons('names', {matchCategories: true});

export const presets = {
	characters,
	weapons,
	fishingRods,
};

fs.promises.writeFile('src/presets.json', JSON.stringify(presets), error => {
	/* V8 ignore next 3 */
	if (error) {
		console.error(error);
	}
});
