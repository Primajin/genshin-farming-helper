import fs from 'node:fs';
import genshinDb from 'genshin-db';

const defaultOptions = {matchCategories: true, verboseCategories: true};
const talentMaterials = genshinDb.materials('Character Talent Material', defaultOptions).filter(material => !material?.name.startsWith('Crown')).sort((a, b) => a.sortorder - b.sortorder);
const weaponMaterials = genshinDb.materials('Weapon Ascension Material', defaultOptions).sort((a, b) => a.sortorder - b.sortorder);
const characterAscensionMaterials = genshinDb.materials('Character Ascension Material', defaultOptions).sort((a, b) => a.sortorder - b.sortorder);
const characterWeaponEnhancementMaterialNames = new Set(genshinDb.materials('Character and Weapon Enhancement Material', defaultOptions).map(material => material?.name));
const allMaterials = genshinDb.materials('names', defaultOptions);
const characterWeaponEnhancementMaterials = allMaterials.filter(material => characterWeaponEnhancementMaterialNames.has(material?.name)).sort((a, b) => a.sortorder - b.sortorder);
const characterLVLMaterials = allMaterials.filter(material => material?.materialtype.startsWith('Character Level-Up Material') && !material?.description.startsWith('Character Ascension')).sort((a, b) => a.sortorder - b.sortorder);
const localSpecialties = allMaterials.filter(material => material?.materialtype.startsWith('Local')).sort((a, b) => a.sortorder - b.sortorder);
const fish = allMaterials.filter(material => material?.materialtype === 'Fish').sort((a, b) => a.sortorder - b.sortorder);

const materials = {
	characterAscensionMaterials,
	characterLVLMaterials,
	characterWeaponEnhancementMaterials,
	fish,
	localSpecialties,
	talentMaterials,
	weaponMaterials,
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
	return rarityInt > 2 ? (rarityInt === 3 ? !material.source.includes('Stardust Exchange') : true) : false;
});

const materialsRare = {
	characterAscensionMaterials: characterAscensionMaterialsRare,
	characterLVLMaterials,
	characterWeaponEnhancementMaterials: characterWeaponEnhancementMaterialsRare,
	fish,
	localSpecialties,
	talentMaterials: talentMaterialsRare,
	weaponMaterials: weaponMaterialsRare,
};

fs.writeFile('src/data-rare.json', JSON.stringify(materialsRare), error => {
	if (error) {
		console.error(error);
	}
});
