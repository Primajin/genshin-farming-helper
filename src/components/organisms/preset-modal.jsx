/** @jsxImportSource @emotion/react */
import PropTypes from 'prop-types';
import {useState} from 'react';
import ModalDialog from 'components/organisms/modal-dialog.jsx';
import TabPanel from 'components/molecules/tab-panel.jsx';
import PresetGrid from 'components/molecules/preset-grid.jsx';
import presets from 'presets';

const tabs = [
	{id: 'characters', label: 'Characters'},
	{id: 'weapons', label: 'Weapons'},
	{id: 'fishingRods', label: 'Fishing Rods'},
];

function PresetModal({isOpen, onClose, activePresets, onPresetChange}) {
	const [activeTab, setActiveTab] = useState('characters');

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

	return (
		<ModalDialog isOpen={isOpen} title='Add Preset' onClose={onClose}>
			<TabPanel
				tabs={tabs}
				activeTab={activeTab}
				onTabChange={setActiveTab}
			>
				<PresetGrid
					presets={currentPresets}
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
