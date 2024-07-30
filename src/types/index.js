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

export const helpersType = {
	name: PropTypes.string,
	tierFour: PropTypes.number,
	tierFourGoal: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	tierOne: PropTypes.number,
	tierOneGoal: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	tierOneLock: PropTypes.bool,
	tierThree: PropTypes.number,
	tierThreeGoal: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	tierThreeLock: PropTypes.bool,
	tierTwo: PropTypes.number,
	tierTwoGoal: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	tierTwoLock: PropTypes.bool,
	type: PropTypes.string,
};
