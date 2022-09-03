import PropTypes from 'prop-types';

import backgrounds from './backgrounds.js';

function ItemPicker({materials}) {
	return (
		<>
			{materials.map(material => (
				<label key={material.name} title={material.name}>
					<input type='radio' name='item' value=''/>
					<div style={{backgroundImage: `url(${backgrounds[(material.rarity ?? 1) - 1]})`}}>
						<img src={material.images?.fandom} alt={material.name} width='75' height='75'/>
					</div>
					<span>{material.name}</span>
				</label>
			))}
		</>
	);
}

ItemPicker.propTypes = {
	materials: PropTypes.array.isRequired,
};

export default ItemPicker;
