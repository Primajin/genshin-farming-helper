/** @jsxImportSource @emotion/react */
import PropTypes from 'prop-types';
import {css} from '@emotion/react';
import PresetCard from 'components/atoms/preset-card.jsx';

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

				return (
					<PresetCard
						key={presetId}
						preset={preset}
						type={type}
						isActive={isActive}
						onClick={onPresetClick}
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
