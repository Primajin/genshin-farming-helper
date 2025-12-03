/** @jsxImportSource @emotion/react */
import {useState} from 'react';
import PropTypes from 'prop-types';
import {css} from '@emotion/react';
import { levelOptions } from '../constants/levels';
import presets from '../presets.json';

const modalBackdrop = css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const modalContent = css`
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  max-width: 500px;
  width: 100%;
`;

const tabs = css`
  display: flex;
  margin-bottom: 20px;
`;

const tab = active => css`
  padding: 10px 20px;
  cursor: pointer;
  border: 1px solid #ccc;
  border-bottom: ${active ? 'none' : '1px solid #ccc'};
  background-color: ${active ? 'white' : '#f1f1f1'};
  margin-bottom: -1px;
`;

const tabContent = css`
  border: 1px solid #ccc;
  padding: 20px;
`;

const levelSelector = css`
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
`;

function PresetPicker({onClose, onAddPreset}) {
  const [activeTab, setActiveTab] = useState('characters');
  const { characters, weapons, fishingRods } = presets;
  const [selectedItem, setSelectedItem] = useState(characters[0].name);
  const [currentLevel, setCurrentLevel] = useState('1');
  const [targetLevel, setTargetLevel] = useState('90');

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    if (tabName === 'characters' && characters.length > 0) {
      setSelectedItem(characters[0].name);
    } else if (tabName === 'weapons' && weapons.length > 0) {
      setSelectedItem(weapons[0].name);
    } else if (tabName === 'fishingRods' && fishingRods.length > 0) {
      setSelectedItem(fishingRods[0].name);
    }
  };

  const handleAddClick = () => {
    let materials = [];
    if (activeTab === 'fishingRods') {
      const rod = fishingRods.find(r => r.name === selectedItem);
      materials = rod.source.map(fish => ({ name: fish, count: 20 }));
    } else {
      const items = activeTab === 'characters' ? characters : weapons;
      const item = items.find(i => i.name === selectedItem);
      const costs = item.costs;
      const startIndex = levelOptions.indexOf(currentLevel);
      const endIndex = levelOptions.indexOf(targetLevel);

      if (startIndex < endIndex) {
        for (let i = startIndex; i < endIndex; i++) {
          const levelKey = `ascend${i}`;
          if (costs[levelKey]) {
            costs[levelKey].forEach(material => {
              const existingMaterial = materials.find(m => m.name === material.name);
              if (existingMaterial) {
                existingMaterial.count += material.count;
              } else {
                materials.push({ ...material });
              }
            });
          }
        }
      }
    }
    onAddPreset({
      name: selectedItem,
      currentLevel,
      targetLevel,
      materials,
    });
    onClose();
  };

  const renderTabContent = () => {
    let items = [];
    if (activeTab === 'characters') {
      items = characters;
    } else if (activeTab === 'weapons') {
      items = weapons;
    } else {
      items = fishingRods.map(rod => rod.name);
    }

    return (
      <div>
        <select value={selectedItem} onChange={e => setSelectedItem(e.target.value)}>
          {items.map(name => <option key={name} value={name}>{name}</option>)}
        </select>
        {activeTab !== 'fishingRods' && (
        <div css={levelSelector}>
          <label>
            Current Level:
            <select value={currentLevel} onChange={e => setCurrentLevel(e.target.value)}>
              {levelOptions.map(level => <option key={level} value={level}>{level}</option>)}
            </select>
          </label>
          <label>
            Target Level:
            <select value={targetLevel} onChange={e => setTargetLevel(e.target.value)}>
              {levelOptions.map(level => <option key={level} value={level}>{level}</option>)}
            </select>
          </label>
        </div>
         )}
      </div>
    );
  };

  return (
    <div css={modalBackdrop} onClick={onClose}>
      <div css={modalContent} onClick={e => e.stopPropagation()}>
        <h2>Preset Picker</h2>
        <div css={tabs}>
          <div css={tab(activeTab === 'characters')} onClick={() => handleTabClick('characters')}>Characters</div>
          <div css={tab(activeTab === 'weapons')} onClick={() => handleTabClick('weapons')}>Weapons</div>
          <div css={tab(activeTab === 'fishingRods')} onClick={() => handleTabClick('fishingRods')}>Fishing Rods</div>
        </div>
        <div css={tabContent}>
          {renderTabContent()}
        </div>
        <button onClick={handleAddClick}>Add</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

PresetPicker.propTypes = {
  onClose: PropTypes.func.isRequired,
  onAddPreset: PropTypes.func.isRequired,
};

export default PresetPicker;
