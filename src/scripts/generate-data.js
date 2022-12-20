import fs from 'node:fs';
import genshinDb from 'genshin-db';

const defaultOptions = {matchCategories: true, verboseCategories: true};
const sundayDrops = genshinDb.materials('Sunday', defaultOptions).sort((a, b) => a.sortorder - b.sortorder);
const talentMaterials = sundayDrops.filter(material => material?.materialtype.startsWith('Talent'));
const weaponMaterials = sundayDrops.filter(material => material?.materialtype.startsWith('Weapon'));
const characterMaterials = genshinDb.materials('names', defaultOptions).filter(material => material?.materialtype.startsWith('Character Level-Up Material') || material?.materialtype.startsWith('Local')).sort((a, b) => a.sortorder - b.sortorder);
const characterAscensionMaterials = characterMaterials.filter(material => material?.description.startsWith('Character Ascension'));
const characterLVLMaterials = characterMaterials.filter(material => !material?.description.startsWith('Character Ascension'));
const localSpecialties = characterMaterials.filter(material => material?.materialtype.startsWith('Local'));

const materials = {
	talentMaterials,
	weaponMaterials,
	characterAscensionMaterials,
	characterLVLMaterials,
	localSpecialties,
};

fs.writeFile('src/data.json', JSON.stringify(materials), error => {
	if (error) {
		console.log(error);
	}
});

const talentMaterialsRare = materials.talentMaterials.filter(material => Number.parseInt(material?.rarity, 10) > 3);
const weaponMaterialsRare = materials.weaponMaterials.filter(material => Number.parseInt(material?.rarity, 10) > 4);
const characterAscensionMaterialsRare = materials.characterAscensionMaterials.filter(material => Number.parseInt(material?.rarity, 10) > 4);
const characterLVLMaterialsRare = materials.characterLVLMaterials.filter(material => {
	const rarityInt = Number.parseInt(material?.rarity, 10);
	return rarityInt > 2 ? (rarityInt === 3 ? !material.source.includes('Stardust Exchange') : true) : false;
});

const materialsRare = {
	talentMaterials: talentMaterialsRare,
	weaponMaterials: weaponMaterialsRare,
	characterAscensionMaterials: characterAscensionMaterialsRare,
	characterLVLMaterials: characterLVLMaterialsRare,
	localSpecialties,
};

fs.writeFile('src/data-rare.json', JSON.stringify(materialsRare), error => {
	if (error) {
		console.log(error);
	}
});
