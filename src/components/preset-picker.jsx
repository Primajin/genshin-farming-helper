/** @jsxImportSource @emotion/react */
import PropTypes from 'prop-types';
import {css} from '@emotion/react';
import {useState} from 'react';

import {backgrounds, IMG_URL, IMG_URL2} from '../constants';

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

	input:checked + div {
		opacity: .5;
	}
`;

function PresetPicker({presets, type, activePresets}) {
	return presets.map(preset => {
		const presetId = `${type}.${preset.id}`;
		const isActive = activePresets.includes(presetId);
		const rarity = (preset.rarity ?? 1) - 1;
		// eslint-disable-next-line no-warning-comments
		// FIXME find a better way
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const [source, setSource] = useState(`${IMG_URL}${preset.images?.filename_icon}.png`);

		let tooManyRetries = 0;
		const tryOtherUrl = () => {
			if (!tooManyRetries) {
				setSource(`${IMG_URL2}${preset.images?.filename_icon}.png`);
			}

			tooManyRetries++;
		};

		return (
			<label key={`PresetPicker${presetId}`} data-testid={`PresetPicker${presetId}`} css={wrapper} title={preset.name}>
				<input readOnly checked={isActive} type='checkbox' name='preset' value={presetId}/>
				<div style={{
					backgroundImage: `url(${backgrounds[rarity]})`,
				}}
				>
					<img data-testid='image' alt={preset.name} src={source} width='75' height='75' onError={tryOtherUrl}/>
				</div>
				<span>{preset.name}</span>
			</label>
		);
	});
}

PresetPicker.propTypes = {
	activePresets: PropTypes.arrayOf(PropTypes.string).isRequired,
	presets: PropTypes.arrayOf(PropTypes.object).isRequired,
	type: PropTypes.string.isRequired,
};

export default PresetPicker;
