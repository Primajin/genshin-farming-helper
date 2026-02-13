import PropTypes from 'prop-types';
import {materialTypes} from 'constants/index.js';
import {filterObject} from 'utils/objects.js';
import {removeQuotesFromString} from 'utils/strings.js';
import ItemCard from 'components/atoms/item-card.jsx';

const DEFAULT_PROPERTIES = {
	list: [],
	materials: [],
	type: '',
};

function ItemPicker(properties) {
	const {list, materials, type} = {...DEFAULT_PROPERTIES, ...filterObject(properties)};
	return materials.map(material => {
		const materialId = `${material.id}`;
		const goesUpTo5 = Boolean(material['5starname']);
		const rarity = type === materialTypes.BUILDING || type === materialTypes.LOCAL ? 0 : (material.rarity ?? (goesUpTo5 ? 5 : 4)) - 1;
		const isDisabled = list.includes(materialId);
		const name = removeQuotesFromString(material.name);

		return (
			<ItemCard
				key={`ItemPicker${materialId}`}
				data-testid={`ItemPicker${materialId}`}
				name={name}
				value={`${type}.${materialId}`}
				rarity={rarity}
				icon={material.images?.filename_icon}
				isDisabled={isDisabled}
			/>
		);
	});
}

ItemPicker.propTypes = {
	list: PropTypes.arrayOf(PropTypes.string),
	materials: PropTypes.arrayOf(PropTypes.object),
	type: PropTypes.string,
};

export default ItemPicker;
