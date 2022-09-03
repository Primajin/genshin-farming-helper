import PropTypes from 'prop-types';

import backgrounds from './backgrounds.js';

const ItemsPicker = ({materials}) => materials.map(material => (
	<label key={material.name} title={material.name}>
		<input type='radio' name='item' value={material.name}/>
		<div style={{
			backgroundImage: `url(${backgrounds[(material.rarity ?? 1) - 1]})`,
		}}
		>
			<img
				src={material.images?.fandom} alt={material.name} width='75'
				height='75'/>
		</div>
		<span>{material.name}</span>
	</label>
),
);

ItemsPicker.propTypes = {
	materials: PropTypes.array.isRequired,
};

export default ItemsPicker;
