/** @jsxImportSource @emotion/react */
import PropTypes from 'prop-types';
import {css} from '@emotion/react';
import ItemCard from 'components/atoms/item-card.jsx';

const grid = css`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(75px, 1fr));
	gap: 10px;
	padding: 10px;
	max-height: 400px;
	overflow-y: auto;

	/* Scrollbar styling */
	&::-webkit-scrollbar {
		width: 8px;
	}

	&::-webkit-scrollbar-track {
		background: rgba(0, 0, 0, 0.1);
		border-radius: 4px;
	}

	&::-webkit-scrollbar-thumb {
		background: rgba(0, 0, 0, 0.3);
		border-radius: 4px;

		&:hover {
			background: rgba(0, 0, 0, 0.5);
		}
	}
`;

function PresetGrid({presets, type, activePresets, onPresetClick}) {
	return (
		<div css={grid}>
			{presets.map(preset => {
				const presetId = `${type}.${preset.id}`;
				const isActive = activePresets.includes(presetId);

				const handleClick = event => {
					event.preventDefault();
					event.stopPropagation();
					onPresetClick({target: {value: presetId}});
				};

				return (
					<ItemCard
						key={presetId}
						isReadOnly
						name={preset.name}
						value={presetId}
						rarity={(preset.rarity ?? 1) - 1}
						icon={preset.images?.filename_icon}
						type='checkbox'
						inputName='preset'
						isChecked={isActive}
						onClick={handleClick}
					/>
				);
			})}
		</div>
	);
}

PresetGrid.propTypes = {
	activePresets: PropTypes.arrayOf(PropTypes.string).isRequired,
	onPresetClick: PropTypes.func.isRequired,
	presets: PropTypes.arrayOf(PropTypes.object).isRequired,
	type: PropTypes.string.isRequired,
};

export default PresetGrid;
