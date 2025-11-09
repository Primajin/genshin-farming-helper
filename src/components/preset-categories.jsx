/** @jsxImportSource @emotion/react */
import PropTypes from 'prop-types';
import {css} from '@emotion/react';

import theme from '../theme';
import PresetPicker from './preset-picker.jsx';
import presets from '../presets.json';

const categories = css`
	margin: 25px auto 0;
	max-width: 396px;

	fieldset {
		background: ${theme.primary};
		border: 1px solid rgba(0,0,0,0.5);
		border-radius: 7px;
		display: flex;
		flex-flow: row wrap;
		justify-content: space-around;
		margin-top: 25px;
		padding: 5px 10px 6px;

		label {
			margin: 5px 0;
			width: 75px;

			&:empty {
				margin: 0;
			}
		}
	}

	legend {
		background: ${theme.primary};
		border: 1px solid rgba(0,0,0,0.5);
		border-bottom: 0;
		border-radius: 7px 7px 0 0;
		padding: 5px 18px 0;
		position: relative;
		top: -11px;
	}
`;

function PresetCategories({activePresets, onChangeProp}) {
	return (
		<form css={categories} onChange={onChangeProp}>
			<fieldset role='group'>
				<legend>Characters</legend>
				<PresetPicker presets={presets.characters} type='character' activePresets={activePresets}/>
				<label/><label/><label/><label/>
			</fieldset>

			<fieldset role='group'>
				<legend>Weapons</legend>
				<PresetPicker presets={presets.weapons} type='weapon' activePresets={activePresets}/>
				<label/><label/><label/><label/>
			</fieldset>
		</form>
	);
}

PresetCategories.propTypes = {
	activePresets: PropTypes.arrayOf(PropTypes.string).isRequired,
	onChangeProp: PropTypes.func.isRequired,
};

export default PresetCategories;
