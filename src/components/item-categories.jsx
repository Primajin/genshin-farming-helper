/** @jsxImportSource @emotion/react */
import PropTypes from 'prop-types';
import {css} from '@emotion/react';
import theme from '../theme';
import {materialTypes} from '../constants';
import {materialsType} from '../types';
import ItemPicker from './item-picker.jsx';

const categories = css`
	margin: 25px auto 0;
	max-width: 396px;

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
		padding: 5px 18px 0;
		position: relative;
		top: -11px;
	}
`;

function ItemCategories({
	list,
	materials: {
		buildingMaterials,
		characterAscensionMaterials,
		characterLVLMaterials,
		characterWeaponEnhancementMaterials,
		fish,
		localSpecialties,
		talentMaterials,
		weaponMaterials,
		wood,
	},
	onChangeProp,
}) {
	return (
		<form css={categories} onChange={onChangeProp}>
			<fieldset className='narrow' role='group'>
				<legend>Character Talent</legend>
				<ItemPicker materials={talentMaterials} type={materialTypes.TALENT} list={list}/>
				<label/><label/><label/><label/>
			</fieldset>

			<fieldset className='narrow' role='group'>
				<legend>Weapon Ascension</legend>
				<ItemPicker materials={weaponMaterials} type={materialTypes.WEAPON} list={list}/>
				<label/><label/><label/><label/>
			</fieldset>

			<fieldset role='group'>
				<legend>Character and Weapon Enhancement</legend>
				<ItemPicker materials={characterWeaponEnhancementMaterials} type={materialTypes.ENHANCEMENT} list={list}/>
				<label/><label/><label/><label/>
			</fieldset>

			<fieldset role='group'>
				<legend>Character Ascension</legend>
				<ItemPicker materials={characterAscensionMaterials} type={materialTypes.ASCENSION} list={list}/>
				<label/><label/><label/><label/>
			</fieldset>

			<fieldset role='group'>
				<legend>Character Level-Up</legend>
				<ItemPicker materials={characterLVLMaterials} type={materialTypes.LEVEL} list={list}/>
				<label/><label/><label/><label/>
			</fieldset>

			<fieldset role='group'>
				<legend>Local Specialties</legend>
				<ItemPicker materials={localSpecialties} type={materialTypes.LOCAL} list={list}/>
				<label/><label/><label/><label/>
			</fieldset>

			<fieldset role='group'>
				<legend>Fish</legend>
				<ItemPicker materials={fish} type={materialTypes.FISH} list={list}/>
				<label/><label/><label/><label/>
			</fieldset>

			<fieldset role='group'>
				<legend>Wood</legend>
				<ItemPicker materials={wood} type={materialTypes.WOOD} list={list}/>
				<label/><label/><label/><label/>
			</fieldset>

			<fieldset role='group'>
				<legend>Building Materials</legend>
				<ItemPicker materials={buildingMaterials} type={materialTypes.BUILDING} list={list}/>
				<label/><label/><label/><label/>
			</fieldset>
		</form>
	);
}

ItemCategories.propTypes = {
	list: PropTypes.arrayOf(PropTypes.string).isRequired,
	materials: PropTypes.shape(materialsType).isRequired,
	onChangeProp: PropTypes.func.isRequired,
};

export default ItemCategories;
