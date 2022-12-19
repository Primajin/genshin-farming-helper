/** @jsxImportSource @emotion/react */
import PropTypes from 'prop-types';
import {css} from '@emotion/react';

import {materialTypes} from '../constants';
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

function ItemCategories({list, materials: {characterAscensionMaterials, characterLVLMaterials, localSpecialties, talentMaterials, weaponMaterials}, onChangeProp}) {
	return (
		<form css={categories} onChange={onChangeProp}>
			<fieldset className='narrow'>
				<legend>Talent Materials</legend>
				<ItemPicker materials={talentMaterials} type={materialTypes.TALENT} list={list}/>
				<label/><label/><label/><label/>
			</fieldset>

			<fieldset className='narrow'>
				<legend>Weapon Materials</legend>
				<ItemPicker materials={weaponMaterials} type={materialTypes.WEAPON} list={list}/>
				<label/><label/><label/><label/>
			</fieldset>

			<fieldset>
				<legend>Character Ascension Materials</legend>
				<ItemPicker materials={characterAscensionMaterials} type={materialTypes.ASCENSION} list={list}/>
				<label/><label/><label/><label/>
			</fieldset>

			<fieldset>
				<legend>Character Level-Up Materials</legend>
				<ItemPicker materials={characterLVLMaterials} type={materialTypes.LEVEL} list={list}/>
				<label/><label/><label/><label/>
			</fieldset>

			<fieldset>
				<legend>Local Specialties</legend>
				<ItemPicker materials={localSpecialties} type={materialTypes.LOCAL} list={list}/>
				<label/><label/><label/><label/>
			</fieldset>
		</form>
	);
}

ItemCategories.propTypes = {
	list: PropTypes.array.isRequired,
	materials: PropTypes.shape({
		characterAscensionMaterials: PropTypes.arrayOf(PropTypes.object),
		characterLVLMaterials: PropTypes.arrayOf(PropTypes.object),
		localSpecialties: PropTypes.arrayOf(PropTypes.object),
		talentMaterials: PropTypes.arrayOf(PropTypes.object),
		weaponMaterials: PropTypes.arrayOf(PropTypes.object),
	}),
	onChangeProp: PropTypes.func.isRequired,
};

export default ItemCategories;
