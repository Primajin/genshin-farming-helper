/** @jsxImportSource @emotion/react */
import PropTypes from 'prop-types';
import {useState} from 'react';
import {css} from '@emotion/react';
import theme from 'theme';
import {materialTypes} from 'constants/index.js';
import {materialsType} from 'types';
import ItemPicker from 'components/molecules/item-picker.jsx';

const searchInput = css`
	clip: auto;
	clip-path: none;
	height: auto;
	overflow: visible;
	position: static;
	white-space: normal;
	width: 100%;
	background: ${theme.primary};
	border: 1px solid rgba(0,0,0,0.3);
	border-radius: 5px;
	color: ${theme.text};
	font-size: 14px;
	margin-top: 10px;
	padding: 8px 12px;
	box-sizing: border-box;
`;

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
	const [searchTerm, setSearchTerm] = useState('');

	const filterMaterials = materials => {
		if (!searchTerm) return materials;
		return materials.filter(material =>
			material.name.toLowerCase().includes(searchTerm.toLowerCase()));
	};

	const filteredTalent = filterMaterials(talentMaterials);
	const filteredWeapon = filterMaterials(weaponMaterials);
	const filteredEnhancement = filterMaterials(characterWeaponEnhancementMaterials);
	const filteredAscension = filterMaterials(characterAscensionMaterials);
	const filteredLevel = filterMaterials(characterLVLMaterials);
	const filteredLocal = filterMaterials(localSpecialties);
	const filteredFish = filterMaterials(fish);
	const filteredWood = filterMaterials(wood);
	const filteredBuilding = filterMaterials(buildingMaterials);

	return (
		<form css={categories} onChange={onChangeProp}>
			<input
				css={searchInput}
				type='text'
				placeholder='Search items…'
				aria-label='Search items'
				value={searchTerm}
				onChange={event => setSearchTerm(event.target.value)}
			/>

			{(!searchTerm || filteredTalent.length > 0) && (
				<fieldset className='narrow' role='group'>
					<legend>Character Talent</legend>
					<ItemPicker materials={filteredTalent} type={materialTypes.TALENT} list={list}/>
					<label/><label/><label/><label/>
				</fieldset>
			)}

			{(!searchTerm || filteredWeapon.length > 0) && (
				<fieldset className='narrow' role='group'>
					<legend>Weapon Ascension</legend>
					<ItemPicker materials={filteredWeapon} type={materialTypes.WEAPON} list={list}/>
					<label/><label/><label/><label/>
				</fieldset>
			)}

			{(!searchTerm || filteredEnhancement.length > 0) && (
				<fieldset role='group'>
					<legend>Character and Weapon Enhancement</legend>
					<ItemPicker materials={filteredEnhancement} type={materialTypes.ENHANCEMENT} list={list}/>
					<label/><label/><label/><label/>
				</fieldset>
			)}

			{(!searchTerm || filteredAscension.length > 0) && (
				<fieldset role='group'>
					<legend>Character Ascension</legend>
					<ItemPicker materials={filteredAscension} type={materialTypes.ASCENSION} list={list}/>
					<label/><label/><label/><label/>
				</fieldset>
			)}

			{(!searchTerm || filteredLevel.length > 0) && (
				<fieldset role='group'>
					<legend>Character Level-Up</legend>
					<ItemPicker materials={filteredLevel} type={materialTypes.LEVEL} list={list}/>
					<label/><label/><label/><label/>
				</fieldset>
			)}

			{(!searchTerm || filteredLocal.length > 0) && (
				<fieldset role='group'>
					<legend>Local Specialties</legend>
					<ItemPicker materials={filteredLocal} type={materialTypes.LOCAL} list={list}/>
					<label/><label/><label/><label/>
				</fieldset>
			)}

			{(!searchTerm || filteredFish.length > 0) && (
				<fieldset role='group'>
					<legend>Fish</legend>
					<ItemPicker materials={filteredFish} type={materialTypes.FISH} list={list}/>
					<label/><label/><label/><label/>
				</fieldset>
			)}

			{(!searchTerm || filteredWood.length > 0) && (
				<fieldset role='group'>
					<legend>Wood</legend>
					<ItemPicker materials={filteredWood} type={materialTypes.WOOD} list={list}/>
					<label/><label/><label/><label/>
				</fieldset>
			)}

			{(!searchTerm || filteredBuilding.length > 0) && (
				<fieldset role='group'>
					<legend>Building Materials</legend>
					<ItemPicker materials={filteredBuilding} type={materialTypes.BUILDING} list={list}/>
					<label/><label/><label/><label/>
				</fieldset>
			)}
		</form>
	);
}

ItemCategories.propTypes = {
	list: PropTypes.arrayOf(PropTypes.string).isRequired,
	materials: PropTypes.shape(materialsType).isRequired,
	onChangeProp: PropTypes.func.isRequired,
};

export default ItemCategories;
