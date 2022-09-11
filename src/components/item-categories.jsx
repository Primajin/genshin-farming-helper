/** @jsxImportSource @emotion/react */
import PropTypes from 'prop-types';
import genshinDB from 'genshin-db';
import {css} from '@emotion/react';

import {commonDrops, materialTypes} from '../constants';
import theme from '../theme';
import ItemPicker from './item-picker.jsx';

const categories = css`
	fieldset {
		background: ${theme.primary};
		border: 1px solid rgba(0,0,0,0.5);
		border-radius: 7px;
		display: flex;
		flex-flow: row wrap;
		justify-content: space-around;
		margin-top: 25px;
		padding: 5px 10px 6px;

		&.narrow {
			padding-left: 55px;
			padding-right: 55px;
		}

		label {
			margin: 5px 0;
			width: 75px;

			&:empty {
				margin: 0;
			}
		}
	}

	legend {
		background: ${theme.primary};
		border: 1px solid rgba(0,0,0,0.5);
		border-bottom: 0;
		border-radius: 7px 7px 0 0;
		padding: 3px 5px 0;
		position: relative;
		top: -10px;
	}
`;

const getAllMaterialItemsFromDB = type => genshinDB.materials(type, {matchCategories: true, verboseCategories: true}).sort((a, b) => a.sortorder - b.sortorder);

const characterMaterials = getAllMaterialItemsFromDB('Character Level-Up Material');
const characterAscensionMaterials = characterMaterials.filter(material => material?.description.startsWith('Character Ascension') && Number.parseInt(material?.rarity, 10) > 4);
const characterLVLMaterials = characterMaterials.filter(material => {
	const {description, name, rarity} = material ?? {};
	if (description.startsWith('Character Ascension')) {
		return false;
	}

	const rarityInt = Number.parseInt(rarity, 10);
	return rarityInt > 2 ? (rarityInt === 3 ? commonDrops.includes(name) : true) : false;
});

const weaponMaterials2 = genshinDB.weaponmaterialtypes('names', {matchCategories: true, verboseCategories: true});
const talentMaterials2 = genshinDB.talentmaterialtypes('names', {matchCategories: true, verboseCategories: true});

function ItemCategories({onChangeProp}) {
	return (
		<form css={categories} onChange={onChangeProp}>
			<fieldset className='narrow'>
				<legend>Talent Materials</legend>
				<ItemPicker materials={talentMaterials2} type={materialTypes.TALENT}/>
				<label/><label/><label/><label/>
			</fieldset>

			<fieldset className='narrow'>
				<legend>Weapon Materials</legend>
				<ItemPicker materials={weaponMaterials2} type={materialTypes.WEAPON}/>
				<label/><label/><label/><label/>
			</fieldset>

			<fieldset>
				<legend>Character Ascension Materials</legend>
				<ItemPicker materials={characterAscensionMaterials} type={materialTypes.ASCENSION}/>
				<label/><label/><label/><label/>
			</fieldset>

			<fieldset>
				<legend>Character Level-Up Materials</legend>
				<ItemPicker materials={characterLVLMaterials} type={materialTypes.LEVEL}/>
				<label/><label/><label/><label/>
			</fieldset>
		</form>
	);
}

ItemCategories.propTypes = {
	onChangeProp: PropTypes.func.isRequired,
};

export default ItemCategories;
