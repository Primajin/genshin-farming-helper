/** @jsxImportSource @emotion/react */
import PropTypes from 'prop-types';
import {css} from '@emotion/react';
import {useState} from 'react';

import {backgrounds, IMG_URL, materialTypes} from '../constants';
import {cleanName} from '../utils/string-manipulation.js';

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
		// eslint-disable-next-line no-warning-comments
		// FIXME find a better way
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const [src, setSrc] = useState(`${IMG_URL}${item.images?.nameicon}.png`);

		let tooManyRetries = 0;
		const tryOtherUrl = () => {
			if (!tooManyRetries) {
				setSrc(`https://i2.wp.com/gi-builds.sfo3.digitaloceanspaces.com/materials/${cleanName(material.name)}.png`);
			}

			tooManyRetries++;
		};

		return (
			<label key={material.name} css={wrapper} title={material.name} aria-disabled={disabled}>
				<input type='radio' name='item' value={`${type}.${material.name}`} disabled={disabled}/>
				<div style={{
					backgroundImage: `url(${backgrounds[rarity]})`,
				}}
				>
					<img data-testid='image' alt={material.name} src={src} width='75' height='75' onError={tryOtherUrl}/>
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
