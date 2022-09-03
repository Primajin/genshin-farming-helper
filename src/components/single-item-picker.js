import PropTypes from 'prop-types';

import genshinDB from 'genshin-db';
import backgrounds from './backgrounds.js';

function SingleItemPicker({materials, type}) {
	return materials.map(material => {
		const goesUpTo5 = Boolean(material['5starname']);
		const rarity = (goesUpTo5 ? 5 : 4) - 1;
		const highestName = material['5starname'] ?? material['4starname'];
		const item = genshinDB.materials(highestName);
		return (
			<label key={material.name} title={material.name}>
				<input type='radio' name='item' value={`${type}.${material.name}`}/>
				<div style={{
					backgroundImage: `url(${backgrounds[rarity]})`,
				}}
				>
					<img
						src={item.images?.fandom} alt={material.name} width='75'
						height='75'/>
				</div>
				<span>{material.name}</span>
			</label>
		);
	},
	);
}

SingleItemPicker.propTypes = {
	materials: PropTypes.array.isRequired,
	type: PropTypes.string.isRequired,
};

export default SingleItemPicker;
