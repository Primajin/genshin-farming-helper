import PropTypes from 'prop-types';

export const materialsType = {
	buildingMaterials: PropTypes.arrayOf(PropTypes.object),
	characterAscensionMaterials: PropTypes.arrayOf(PropTypes.object),
	characterLVLMaterials: PropTypes.arrayOf(PropTypes.object),
	characterWeaponEnhancementMaterials: PropTypes.arrayOf(PropTypes.object),
	fish: PropTypes.arrayOf(PropTypes.object),
	localSpecialties: PropTypes.arrayOf(PropTypes.object),
	talentMaterials: PropTypes.arrayOf(PropTypes.object),
	weaponMaterials: PropTypes.arrayOf(PropTypes.object),
	wood: PropTypes.arrayOf(PropTypes.object),
};
