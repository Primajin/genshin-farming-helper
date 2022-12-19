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
