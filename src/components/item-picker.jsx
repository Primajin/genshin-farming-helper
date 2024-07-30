/** @jsxImportSource @emotion/react */
import PropTypes from 'prop-types';
import {css} from '@emotion/react';
import {useState} from 'react';

import {
	backgrounds, IMG_URL, IMG_URL2, materialTypes,
} from '../constants';
import {filterObject} from '../utils/objects.js';
import {removeQuotesFromString} from '../utils/strings.js';

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
		const disabled = list.includes(materialId);
		// eslint-disable-next-line no-warning-comments
		// FIXME find a better way
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const [source, setSource] = useState(`${IMG_URL}${material.images?.filename_icon}.png`);

		let tooManyRetries = 0;
		const tryOtherUrl = () => {
			if (!tooManyRetries) {
				setSource(`${IMG_URL2}${material.images?.filename_icon}.png`);
			}

			tooManyRetries++;
		};

		const name = removeQuotesFromString(material.name);

		return (
			<label key={`ItemPicker${materialId}`} data-testid={`ItemPicker${materialId}`} css={wrapper} title={name} aria-disabled={disabled}>
				<input type='radio' name='item' value={`${type}.${materialId}`} disabled={disabled}/>
				<div style={{
					backgroundImage: `url(${backgrounds[rarity]})`,
				}}
				>
					<img data-testid='image' alt={name} src={source} width='75' height='75' onError={tryOtherUrl}/>
				</div>
				<span>{name}</span>
			</label>
		);
	},
	);
}

ItemPicker.propTypes = {
	list: PropTypes.arrayOf(PropTypes.string),
	materials: PropTypes.arrayOf(PropTypes.object),
	type: PropTypes.string,
};

export default ItemPicker;
