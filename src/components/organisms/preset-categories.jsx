/** @jsxImportSource @emotion/react */
import PropTypes from 'prop-types';
import {css} from '@emotion/react';
import {useState} from 'react';
import theme from 'theme';
import PresetPicker from 'components/molecules/preset-picker.jsx';
import presets from 'presets';

const categories = css`
	margin: 25px auto 0;
	max-width: 396px;

	h3 {
		color: ${theme.text};
		font-size: 1.2em;
		margin: 30px 0 10px;
		text-align: center;
		text-transform: uppercase;
		font-weight: 600;
		letter-spacing: 0.5px;
		
		&:first-of-type {
			margin-top: 10px;
		}
	}

	fieldset {
		background: ${theme.primary};
		border: 1px solid rgba(0,0,0,0.5);
		border-radius: 7px;
		display: flex;
		flex-flow: row wrap;
		justify-content: space-around;
		margin-top: 25px;
		padding: 5px 10px 6px;
		transition: max-height 0.3s ease-out;
		overflow: hidden;

		&.collapsed {
			max-height: 0;
			padding: 0 10px;
			margin-top: 0;
			border: 0;
		}

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
		cursor: pointer;
		user-select: none;
		
		&:hover {
			background: ${theme.secondary};
		}
		
		&::before {
			content: '▼ ';
			font-size: 0.8em;
			margin-right: 5px;
		}
		
		&.collapsed {
			border-radius: 7px;
			border-bottom: 1px solid rgba(0,0,0,0.5);
			margin-bottom: 15px;
			
			&::before {
				content: '▶ ';
			}
		}
	}
`;

function PresetCategories({activePresets, onChangeProp}) {
	const [collapsed, setCollapsed] = useState({
		characters: true,
		weapons: true,
		fishingRods: true,
	});

	const toggleCollapse = section => {
		setCollapsed(previous => ({...previous, [section]: !previous[section]}));
	};

	// Empty labels for grid alignment (4 per row)
	const emptyLabels = Array.from({length: 4}, (_, index) => <label key={`empty-${index}`}/>);

	return (
		<form css={categories}>
			<h3>Presets</h3>

			<fieldset role='group' className={collapsed.characters ? 'collapsed' : ''}>
				<legend className={collapsed.characters ? 'collapsed' : ''} onClick={() => toggleCollapse('characters')}>
					Characters
				</legend>
				<PresetPicker presets={presets.characters} type='character' activePresets={activePresets} onClickProp={onChangeProp}/>
				{emptyLabels}
			</fieldset>

			<fieldset role='group' className={collapsed.weapons ? 'collapsed' : ''}>
				<legend className={collapsed.weapons ? 'collapsed' : ''} onClick={() => toggleCollapse('weapons')}>
					Weapons
				</legend>
				<PresetPicker presets={presets.weapons} type='weapon' activePresets={activePresets} onClickProp={onChangeProp}/>
				{emptyLabels}
			</fieldset>

			<fieldset role='group' className={collapsed.fishingRods ? 'collapsed' : ''}>
				<legend className={collapsed.fishingRods ? 'collapsed' : ''} onClick={() => toggleCollapse('fishingRods')}>
					Fishing Rods
				</legend>
				<PresetPicker presets={presets.fishingRods} type='fishingRod' activePresets={activePresets} onClickProp={onChangeProp}/>
				{emptyLabels}
			</fieldset>
		</form>
	);
}

PresetCategories.propTypes = {
	activePresets: PropTypes.arrayOf(PropTypes.string).isRequired,
	onChangeProp: PropTypes.func.isRequired,
};

export default PresetCategories;
