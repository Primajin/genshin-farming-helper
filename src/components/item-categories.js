import PropTypes from 'prop-types';
import genshinDB from 'genshin-db';

import {materialTypes} from '../constants';
import ItemsPicker from './items-picker.js';
import SingleItemPicker from './single-item-picker.js';

const getAllMaterialItemsFromDB = type => genshinDB.materials(type, {matchCategories: true, verboseCategories: true}).sort((a, b) => a.sortorder - b.sortorder);

const characterMaterials = getAllMaterialItemsFromDB('Character Level-Up Material');
const characterLVLMaterials = characterMaterials.filter(material => !material?.description.startsWith('Character Ascension'));
const characterAscensionMaterials = characterMaterials.filter(material => material?.description.startsWith('Character Ascension'));

const weaponMaterials2 = genshinDB.weaponmaterialtypes('names', {matchCategories: true, verboseCategories: true});
const talentMaterials2 = genshinDB.talentmaterialtypes('names', {matchCategories: true, verboseCategories: true});

function ItemCategories({onChangeProp, onSubmitProp}) {
	return (
		<form
			className='choose-item'
			onChange={onChangeProp}
			onSubmit={onSubmitProp}
		>
			<button type='submit' className='material-icons plus-button'>note_add</button>

			<fieldset className='narrow'>
				<legend>Talent Materials:</legend>
				<SingleItemPicker materials={talentMaterials2} type={materialTypes.TALENT}/>
			</fieldset>

			<fieldset className='narrow'>
				<legend>Weapon Materials:</legend>
				<SingleItemPicker materials={weaponMaterials2} type={materialTypes.WEAPON}/>
			</fieldset>

			{/* <fieldset className='narrow'> */}
			{/*	<legend>Character Level-Up Materials:</legend> */}
			{/*	<ItemsPicker materials={characterLVLMaterials}/> */}
			{/* </fieldset> */}

			{/* <fieldset> */}
			{/*	<legend>Character Ascension Materials:</legend> */}
			{/*	<ItemsPicker materials={characterAscensionMaterials}/> */}
			{/* </fieldset> */}

			<button type='submit' className='material-icons plus-button'>note_add</button>
		</form>
	);
}

ItemCategories.propTypes = {
	onChangeProp: PropTypes.func.isRequired,
	onSubmitProp: PropTypes.func.isRequired,
};

export default ItemCategories;
