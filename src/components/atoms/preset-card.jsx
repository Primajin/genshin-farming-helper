/** @jsxImportSource @emotion/react */
import PropTypes from 'prop-types';
import {css} from '@emotion/react';
import {useState} from 'react';
import {backgrounds, IMG_URL, IMG_URL2} from 'constants/index.js';

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

function PresetCard({preset, type, isActive, onClick = null}) {
	const presetId = `${type}.${preset.id}`;
	const rarity = (preset.rarity ?? 1) - 1;
	const [source, setSource] = useState(`${IMG_URL}${preset.images?.filename_icon}.png`);

	let tooManyRetries = 0;
	const tryOtherUrl = () => {
		if (!tooManyRetries) {
			setSource(`${IMG_URL2}${preset.images?.filename_icon}.png`);
		}

		tooManyRetries++;
	};

	const handleClick = event => {
		event.preventDefault();
		event.stopPropagation();

		if (onClick) {
			onClick({target: {value: presetId}});
		}
	};

	return (
		<label
			key={`PresetCard${presetId}`}
			data-testid={`PresetCard${presetId}`}
			css={wrapper}
			title={preset.name}
			onClick={handleClick}
		>
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
}

PresetCard.propTypes = {
	isActive: PropTypes.bool.isRequired,
	onClick: PropTypes.func,
	preset: PropTypes.object.isRequired,
	type: PropTypes.string.isRequired,
};

export default PresetCard;
