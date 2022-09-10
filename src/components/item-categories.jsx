import PropTypes from 'prop-types';
import genshinDB from 'genshin-db';

import {materialTypes} from '../constants';
import ItemPicker from './item-picker.jsx';

const getAllMaterialItemsFromDB = type => genshinDB.materials(type, {matchCategories: true, verboseCategories: true}).sort((a, b) => a.sortorder - b.sortorder);

const characterMaterials = getAllMaterialItemsFromDB('Character Level-Up Material');
const characterLVLMaterials = characterMaterials.filter(material => !material?.description.startsWith('Character Ascension') && Number.parseInt(material?.rarity, 10) > 2);
const characterAscensionMaterials = characterMaterials.filter(material => material?.description.startsWith('Character Ascension') && Number.parseInt(material?.rarity, 10) > 4);

const weaponMaterials2 = genshinDB.weaponmaterialtypes('names', {matchCategories: true, verboseCategories: true});
const talentMaterials2 = genshinDB.talentmaterialtypes('names', {matchCategories: true, verboseCategories: true});

function ItemCategories({onChangeProp}) {
	return (
		<form
			className='choose-item'
			onChange={onChangeProp}
		>
			<fieldset className='narrow'>
				<legend>Talent Materials:</legend>
				<ItemPicker materials={talentMaterials2} type={materialTypes.TALENT}/>
			</fieldset>

			<fieldset className='narrow'>
				<legend>Weapon Materials:</legend>
				<ItemPicker materials={weaponMaterials2} type={materialTypes.WEAPON}/>
			</fieldset>

			<fieldset>
				<legend>Character Ascension Materials:</legend>
				<ItemPicker materials={characterAscensionMaterials} type={materialTypes.ASCENSION}/>
			</fieldset>

			<fieldset>
				<legend>Character Level-Up Materials:</legend>
				<h2>NOT FULLY IMPLEMENTED YET</h2>
				<ItemPicker materials={characterLVLMaterials} type={materialTypes.LEVEL}/>
			</fieldset>
		</form>
	);
}

ItemCategories.propTypes = {
	onChangeProp: PropTypes.func.isRequired,
};

export default ItemCategories;
