import fs from 'node:fs';
import genshinDb from 'genshin-db';

const defaultOptions = {matchCategories: true, verboseCategories: true};
const allMaterials = genshinDb.materials('names', defaultOptions).sort((a, b) => a.sortRank === b.sortRank ? a.id - b.id : a.sortRank - b.sortRank);

const characterAscensionMaterials = allMaterials.filter(material => material?.typeText.startsWith('Character Ascension Material') && !material?.description.startsWith('Character Ascension'));
const characterLVLMaterials = allMaterials.filter(material => material?.typeText.startsWith('Character Level-Up Material') && !material?.description.startsWith('Character Ascension'));
const characterWeaponEnhancementMaterials = allMaterials.filter(material => material?.typeText.startsWith('Character and Weapon Enhancement Material'));
const fish = allMaterials.filter(material => material?.typeText === 'Fish');
const localSpecialties = allMaterials.filter(material => material?.typeText.startsWith('Local'));
const talentMaterials = allMaterials.filter(material => material?.typeText.startsWith('Character Talent Material') && !material?.name.startsWith('Crown of Insight'));
const weaponMaterials = allMaterials.filter(material => material?.typeText.startsWith('Weapon Ascension Material'));
const wood = allMaterials.filter(material => material?.category === 'WOOD');

const materials = {
	characterAscensionMaterials,
	characterLVLMaterials,
	characterWeaponEnhancementMaterials,
	fish,
	localSpecialties,
	talentMaterials,
	weaponMaterials,
	wood,
};

fs.writeFile('src/data.json', JSON.stringify(materials), error => {
	if (error) {
		console.error(error);
	}
});

const talentMaterialsRare = materials.talentMaterials.filter(material => Number.parseInt(material?.rarity, 10) > 3);
const weaponMaterialsRare = materials.weaponMaterials.filter(material => Number.parseInt(material?.rarity, 10) > 4);
const characterAscensionMaterialsRare = materials.characterAscensionMaterials.filter(material => Number.parseInt(material?.rarity, 10) > 4);
const characterWeaponEnhancementMaterialsRare = materials.characterWeaponEnhancementMaterials.filter(material => {
	const rarityInt = Number.parseInt(material?.rarity, 10);
	return rarityInt > 2 ? (rarityInt === 3 ? !material.sources.includes('Stardust Exchange') : true) : false;
});

const materialsRare = {
	characterAscensionMaterials: characterAscensionMaterialsRare,
	characterLVLMaterials,
	characterWeaponEnhancementMaterials: characterWeaponEnhancementMaterialsRare,
	fish,
	localSpecialties,
	talentMaterials: talentMaterialsRare,
	weaponMaterials: weaponMaterialsRare,
	wood,
};

fs.writeFile('src/data-rare.json', JSON.stringify(materialsRare), error => {
	if (error) {
		console.error(error);
	}
});
