/** @jsxImportSource @emotion/react */
import PropTypes from 'prop-types';
import {css} from '@emotion/react';

const presetList = css`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 20px;
`;

const presetItem = css`
  background-color: #f1f1f1;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 5px 10px;
  margin: 5px;
  display: flex;
  align-items: center;
`;

const removeButton = css`
  background-color: transparent;
  border: none;
  cursor: pointer;
  margin-left: 10px;
`;

function ActivePresets({presets, onRemove}) {
	return (
		<div css={presetList}>
			{presets.map((preset, index) => (
				<div key={index} css={presetItem} data-testid={`preset-item-${index}`}>
					<span>{preset.name} ({preset.currentLevel} to {preset.targetLevel})</span>
					<button css={removeButton} onClick={() => onRemove(preset)}>
						<span className='material-symbols-outlined'>close</span>
					</button>
				</div>
			))}
		</div>
	);
}

ActivePresets.propTypes = {
	presets: PropTypes.array.isRequired,
	onRemove: PropTypes.func.isRequired,
};

export default ActivePresets;
