import fs from 'node:fs/promises';
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

const materials = {
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

try {
	await fs.writeFile('src/data.json', JSON.stringify(materials));
} catch (error) {
	console.error(error);
}

const talentMaterialsRare = materials.talentMaterials.filter(material => Number.parseInt(material.rarity, 10) > 3);
const weaponMaterialsRare = materials.weaponMaterials.filter(material => Number.parseInt(material.rarity, 10) > 4);
const characterAscensionMaterialsRare = materials.characterAscensionMaterials.filter(material => Number.parseInt(material.rarity, 10) > 4);
const characterWeaponEnhancementMaterialsRare = materials.characterWeaponEnhancementMaterials.filter(material => {
	const rarityInt = Number.parseInt(material.rarity, 10);
	const sortRankInt = Number.parseInt(material.sortRank, 10);
	return rarityInt > 2 ? (rarityInt === 3 ? !characterWeaponEnhancementMaterials.some(material => material.sortRank === sortRankInt && material.rarity > 3) : true) : false;
});

const materialsRare = {
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

try {
	await fs.writeFile('src/data-rare.json', JSON.stringify(materialsRare));
} catch (error) {
	console.error(error);
}
