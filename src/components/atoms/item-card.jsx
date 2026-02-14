/** @jsxImportSource @emotion/react */
import PropTypes from 'prop-types';
import {css} from '@emotion/react';
import {useRef, useState} from 'react';
import {backgrounds, IMG_URL, IMG_URL2} from 'constants/index.js';
import theme from 'theme';

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

	input:disabled + div {
		opacity: .5;
	}

	input[type="checkbox"]:checked + div {
		box-shadow: inset 0 0 0 2px ${theme.success}, 0 0 8px rgba(76, 175, 80, 0.5);
	}
`;

function ItemCard({
	name,
	value,
	rarity = 0,
	icon = '',
	type = 'radio',
	inputName = 'item',
	isDisabled = false,
	isChecked = false,
	isReadOnly = false,
	onClick = undefined,
	'data-testid': dataTestId,
}) {
	const [source, setSource] = useState(`${IMG_URL}${icon}.png`);
	const hasRetried = useRef(false);

	const tryOtherUrl = () => {
		if (!hasRetried.current) {
			hasRetried.current = true;
			setSource(`${IMG_URL2}${icon}.png`);
		}
	};

	return (
		<label
			data-testid={dataTestId}
			css={wrapper}
			title={name}
			aria-disabled={isDisabled || undefined}
			onClick={onClick}
		>
			<input
				type={type}
				name={inputName}
				value={value}
				disabled={isDisabled || undefined}
				{...(isReadOnly ? {checked: isChecked, readOnly: true} : {})}
			/>
			<div style={{
				backgroundImage: `url(${backgrounds[rarity]})`,
			}}
			>
				<img data-testid='image' alt={name} src={source} width='75' height='75' onError={tryOtherUrl}/>
			</div>
			<span>{name}</span>
		</label>
	);
}

ItemCard.propTypes = {
	'data-testid': PropTypes.string,
	icon: PropTypes.string,
	inputName: PropTypes.string,
	isChecked: PropTypes.bool,
	isDisabled: PropTypes.bool,
	isReadOnly: PropTypes.bool,
	name: PropTypes.string.isRequired,
	onClick: PropTypes.func,
	rarity: PropTypes.number,
	type: PropTypes.oneOf(['radio', 'checkbox']),
	value: PropTypes.string.isRequired,
};

export default ItemCard;
