/** @jsxImportSource @emotion/react */
import PropTypes from 'prop-types';
import {useState} from 'react';
import {css} from '@emotion/react';
import theme from 'theme';
import ModalDialog from 'components/organisms/modal-dialog.jsx';
import TabPanel from 'components/molecules/tab-panel.jsx';
import PresetGrid from 'components/molecules/preset-grid.jsx';
import presets from 'presets';

const searchInput = css`
	clip: auto;
	clip-path: none;
	height: auto;
	overflow: visible;
	position: static;
	white-space: normal;
	width: 100%;
	background: ${theme.primary};
	border: 1px solid rgba(0,0,0,0.3);
	border-radius: 5px;
	color: ${theme.text};
	font-size: 14px;
	margin: 10px 0;
	padding: 8px 12px;
	box-sizing: border-box;
`;

const tabs = [
	{id: 'characters', label: 'Characters'},
	{id: 'weapons', label: 'Weapons'},
	{id: 'fishingRods', label: 'Fishing Rods'},
];

function PresetModal({isOpen, onClose, activePresets, onPresetChange}) {
	const [activeTab, setActiveTab] = useState('characters');
	const [searchTerm, setSearchTerm] = useState('');

	const handleTabChange = tab => {
		setActiveTab(tab);
		setSearchTerm('');
	};

	const getPresetsForTab = () => {
		switch (activeTab) {
			case 'characters': {
				return {presets: presets.characters, type: 'character'};
			}

			case 'weapons': {
				return {presets: presets.weapons, type: 'weapon'};
			}

			case 'fishingRods': {
				return {presets: presets.fishingRods, type: 'fishingRod'};
			}

			default: {
				return {presets: [], type: ''};
			}
		}
	};

	const {presets: currentPresets, type} = getPresetsForTab();

	const filteredPresets = searchTerm
		? currentPresets.filter(preset =>
			preset.name.toLowerCase().includes(searchTerm.toLowerCase()))
		: currentPresets;

	return (
		<ModalDialog isOpen={isOpen} title='Add Preset' onClose={onClose}>
			<TabPanel
				tabs={tabs}
				activeTab={activeTab}
				onTabChange={handleTabChange}
			>
				<input
					css={searchInput}
					type='text'
					placeholder='Search presets…'
					aria-label='Search presets'
					value={searchTerm}
					onChange={event => setSearchTerm(event.target.value)}
				/>
				<PresetGrid
					presets={filteredPresets}
					type={type}
					activePresets={activePresets}
					onPresetClick={onPresetChange}
				/>
			</TabPanel>
		</ModalDialog>
	);
}

PresetModal.propTypes = {
	activePresets: PropTypes.arrayOf(PropTypes.string).isRequired,
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	onPresetChange: PropTypes.func.isRequired,
};

export default PresetModal;
