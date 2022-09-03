import PropTypes from 'prop-types';
import genshinDB from 'genshin-db';

import materials from '../constants';
import ItemPicker from './item-picker.js';

/**
 * Get items for Arraylist
 * @param {string[]} collection
 * @param {string} type
 * @returns {object[][]}
 */
const getItemsFromDBForCollection = (collection, type) => collection.map(itemName => Object.hasOwn(genshinDB, type) && genshinDB[type](itemName));

const getMaterialItemsFromDB = type => {
	const list = genshinDB.materials(type, {matchCategories: true});
	return getItemsFromDBForCollection(list, 'materials').sort((a, b) => a.sortorder - b.sortorder);
};

const talentMaterials = getMaterialItemsFromDB('talent material');
const weaponMaterials = getMaterialItemsFromDB('weapon material');
const ingredients = getMaterialItemsFromDB('ingredient');
const characterMaterials = getMaterialItemsFromDB('Character Level-Up Material');
const characterLVLMaterials = characterMaterials.filter(material => !material.description.startsWith('Character Ascension'));
const characterAscensionMaterials = characterMaterials.filter(material => material.description.startsWith('Character Ascension'));

function ItemCategories({onChangeProp, onSubmitProp}) {
	return (
		<form
			className='choose-item'
			onChange={onChangeProp}
			onSubmit={onSubmitProp}
		>
			<button type='submit' className='material-icons plus-button'>note_add</button>

			<fieldset className='narrow'>
				<legend>Character Level-Up Materials:</legend>
				<ItemPicker materials={characterLVLMaterials}/>
			</fieldset>

			<fieldset>
				<legend>Character Ascension Materials:</legend>
				<ItemPicker materials={characterAscensionMaterials}/>
			</fieldset>

			<fieldset className='narrow'>
				<legend>Talent Materials:</legend>
				<ItemPicker materials={talentMaterials}/>
			</fieldset>

			<fieldset>
				<legend>Weapon Materials:</legend>
				<ItemPicker materials={weaponMaterials}/>
			</fieldset>

			<fieldset>
				<legend>Ingredients:</legend>
				<ItemPicker materials={ingredients}/>
			</fieldset>

			<button type='submit' className='material-icons plus-button'>note_add</button>
		</form>
	);
}

ItemCategories.propTypes = {
	onChangeProp: PropTypes.func.isRequired,
	onSubmitProp: PropTypes.func.isRequired,
};

export default ItemCategories;
