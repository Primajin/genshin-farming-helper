/** @jsxImportSource @emotion/react */
import PropTypes from 'prop-types';

import {css} from '@emotion/react';
import {backgrounds, IMG_URL, materialTypes} from '../constants';

const wrapper = css`
	cursor: pointer;
	font: 12px sans-serif;
	min-height: 75px;

	input + div {
		background: transparent center center no-repeat;
		background-size: contain;
		border-radius: 7px;
		height: 75px;
		margin-bottom: 5px;
		width: 75px;
	}

	input:checked + div,
	input:disabled + div {
		opacity: .5;
	}
`;

function ItemPicker({list, materials, type}) {
	return materials.map(material => {
		const goesUpTo5 = Boolean(material['5starname']);
		const rarity = type === materialTypes.LOCAL ? 0 : (material.rarity ?? (goesUpTo5 ? 5 : 4)) - 1;
		const highestName = material['5starname'] ?? material['4starname'] ?? material.name;
		const item = materials.find(material => material.name === highestName);
		const disabled = list.includes(material.name);
		return (
			<label key={material.name} css={wrapper} title={material.name} aria-disabled={disabled}>
				<input type='radio' name='item' value={`${type}.${material.name}`} disabled={disabled}/>
				<div style={{
					backgroundImage: `url(${backgrounds[rarity]})`,
				}}
				>
					<img alt={material.name} src={`${IMG_URL}${item.images?.nameicon}.png`} width='75' height='75'/>
				</div>
				<span>{material.name}</span>
			</label>
		);
	},
	);
}

ItemPicker.propTypes = {
	list: PropTypes.array,
	materials: PropTypes.array.isRequired,
	type: PropTypes.string.isRequired,
};

ItemPicker.defaultProps = {
	list: [],
	materials: [],
	type: '',
};

export default ItemPicker;
