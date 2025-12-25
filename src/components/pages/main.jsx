/* global window, document */
/** @jsxImportSource @emotion/react */
import {useCallback, useEffect, useState} from 'react';
import {Global, css} from '@emotion/react';
import materials from 'data';
import materialsRare from 'data-rare';
import presets from 'presets';
import storage from 'utils/local-storage.js';
import theme from 'theme/index.js';
import {breakpoints, up} from 'utils/theming.js';
import {fullscreenElement, toggleFullscreen} from 'utils/fullscreen.js';
import {releaseWakeLock, requestWakeLock} from 'utils/wake-lock.js';
import ItemCategories from 'components/organisms/item-categories.jsx';
import PresetModal from 'components/organisms/preset-modal.jsx';
import FarmHelper from 'components/organisms/farm-helper.jsx';

const globalStyles = css`
	*, *::before, *::after {
		box-sizing: border-box;
	}

	body {
		background: transparent top center url("https://genshin.hoyoverse.com/_nuxt/img/poster.47f71d4.jpg") no-repeat fixed;
		background-size: cover;
		margin: 0;
		padding: 0;
		font-family: sans-serif;
		text-align: center;
		user-select: none;
	}

	.material-symbols-outlined {
		font-family: 'Material Symbols Outlined Variable', emoji;
		font-weight: normal;
		font-style: normal;
		font-size: 24px; /* Preferred icon size */
		display: inline-block;
		line-height: 1;
		text-transform: none;
		letter-spacing: normal;
		word-wrap: normal;
		white-space: nowrap;
		direction: ltr;

		/* Support for all WebKit browsers. */
		-webkit-font-smoothing: antialiased;
		/* Support for Safari and Chrome. */
		text-rendering: optimizeLegibility;

		/* Support for Firefox. */
		-moz-osx-font-smoothing: grayscale;

		/* Support for IE. */
		font-feature-settings: 'liga';

		cursor: pointer;

		font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;

		&.fill {
			font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
		}
	}

	input {
		display: none;
	}

	main {
		position: absolute;
		top: 0;
		z-index: 1;
		left: 50%;
		margin: 0 auto;
		width: 100%;
		transform: translateX(-50%);
		padding: 15px 0;

		${up('sm')} {
			max-width: 90%;
		};

		${up('xl')} {
			max-width: ${breakpoints.get('xl')}px;
		};

		section {
			margin-top: 20px;
			min-width: 155px;

			&:empty {
				margin-top: 0;
			}
		}
	}
`;

const video = css`
	height: 100%;
	width: 100%;
	position: fixed;
	top: 0;
	z-index: 0;

	video {
		object-fit: cover;
		width: 100%;
		height: 100%;
	}
`;

const toggleFloat = css`
	margin: 0;
	transform: rotate(90deg);
`;

const metaKeys = css`
	margin: 0;
	position: absolute;
	top: 15px;
`;

const toggleWakeLock = css`
	left: 20px;
`;

const toggleFullScreen = css`
	right: 20px;
`;

const helperList = css`
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;

		${up('md')} {
			justify-content: space-between;
		};
`;

const fab = css`
	position: fixed;
	bottom: 30px;
	right: 30px;
	width: 60px;
	height: 60px;
	border-radius: 50%;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: white;
	border: none;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 32px;
	font-weight: bold;
	transition: all 0.3s ease;
	z-index: 999;

	&:hover {
		transform: scale(1.1);
		box-shadow: 0 6px 25px rgba(0, 0, 0, 0.5);
	}

	&:active {
		transform: scale(0.95);
	}
`;

let didRun = false;
const {actions} = theme;

// Helper function to create initial farm helpers from storage
function createInitialFarmHelpers() {
	const storageState = storage.load();
	const savedHelpers = storageState?.helpers;
	if (savedHelpers && Object.keys(savedHelpers).length > 0) {
		// Return the data needed to create FarmHelper components later
		return Object.entries(savedHelpers).map(([itemId, config]) => ({
			itemId,
			config,
			category: config.category,
		}));
	}

	// Storage is empty, create new
	storage.save({});
	return [];
}

export default function Main() {
	const [farmHelperData, setFarmHelperData] = useState(() => createInitialFarmHelpers());
	const [activePresets, setActivePresets] = useState([]);
	const [floatGroups, setFloatGroups] = useState(false);
	const [fullScreen, setFullScreen] = useState(false);
	const [wakeLockSentinel, setWakeLockSentinel] = useState(null);
	const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);

	const onRemove = itemId => {
		const storageState = storage.load();
		const savedHelpers = storageState?.helpers ?? {};
		delete savedHelpers[itemId];
		storage.save({...storageState, helpers: savedHelpers});
		setFarmHelperData(previousHelpers => previousHelpers.filter(previousHelper => previousHelper.itemId !== itemId));
	};

	// Create the FarmHelper components from the data
	const farmHelperList = farmHelperData.map(({itemId, config, category}) => (
		<FarmHelper
			key={itemId}
			category={category}
			config={config}
			itemId={itemId}
			materials={materials}
			onRemove={onRemove}
		/>
	));

	/**
	 * The config array has seven positions
	 * @typedef ConfigObject
	 * @type {Object}
	 * @property {string} category - The type of the helper
	 * @property {number} tierOne - The tier one value
	 * @property {number | string} tierOneGoal - The tier one goal
	 * @property {bool} tierOneLock - Is tier one locked
	 * @property {number} tierTwo - The tier two value
	 * @property {number | string} tierTwoGoal - The tier two goal
	 * @property {bool} tierTwoLock - Is tier two locked
	 * @property {number} tierThree - The tier three value
	 * @property {number | string} tierThreeGoal - The tier three goal
	 * @property {bool} tierThreeLock - Is tier three locked
	 * @property {number} tierFour - The tier four value
	 * @property {number | string} tierFourGoal - The tier four goal
	 */

	/**
	 * Add a new helper with given Item
	 * @type {(function({[config]: ConfigObject, itemId: string, category: string}): void)|*}
	 */
	const addHelperWithItem = useCallback(helper => {
		const {config, itemId, category} = helper;

		const storageState = storage.load();
		const savedHelpers = storageState?.helpers ?? {};
		const newHelpers = {...savedHelpers, [itemId]: config};
		storage.save({...storageState, helpers: newHelpers});

		setFarmHelperData(previousHelpers =>
			[
				...previousHelpers,
				{itemId, config, category},
			]);
	}, []);

	const onChange = event => {
		const itemName = event.target.value;
		const category = itemName.split('.')[0];
		const itemId = itemName.split('.')[1];
		addHelperWithItem({itemId, category});
	};

	// Helper to get all materials as a flat array
	const getAllMaterialsFlat = () => [
		...materials.buildingMaterials,
		...materials.characterAscensionMaterials,
		...materials.characterLVLMaterials,
		...materials.characterWeaponEnhancementMaterials,
		...materials.fish,
		...materials.localSpecialties,
		...materials.talentMaterials,
		...materials.weaponMaterials,
		...materials.wood,
	];

	// Helper to find material by ID
	const findMaterial = materialId => getAllMaterialsFlat().find(m => m.id === materialId);

	// Helper to find material category by ID
	const findMaterialCategory = materialId => {
		const material = findMaterial(materialId);
		if (!material) {
			return null;
		}

		// Determine category based on material type
		if (materials.talentMaterials.includes(material)) {
			return 'TALENT';
		}

		if (materials.weaponMaterials.includes(material)) {
			return 'WEAPON';
		}

		if (materials.characterWeaponEnhancementMaterials.includes(material)) {
			return 'ENHANCEMENT';
		}

		if (materials.characterAscensionMaterials.includes(material)) {
			return 'ASCENSION';
		}

		if (materials.characterLVLMaterials.includes(material)) {
			return 'LEVEL';
		}

		if (materials.localSpecialties.includes(material)) {
			return 'LOCAL';
		}

		if (materials.fish.includes(material)) {
			return 'FISH';
		}

		if (materials.wood.includes(material)) {
			return 'WOOD';
		}

		if (materials.buildingMaterials.includes(material)) {
			return 'BUILDING';
		}

		return null;
	};

	// Helper to group preset items by sortRank and process them
	const groupPresetItems = presetItems => {
		const grouped = {};

		for (const item of presetItems) {
			const material = findMaterial(item.id);
			if (!material) {
				continue;
			}

			const {sortRank} = material;
			// Group by sortRank only (not item.id) to combine tiers of the same material
			const groupKey = String(sortRank);
			grouped[groupKey] ||= [];

			grouped[groupKey].push({
				...item,
				rarity: Number.parseInt(material.rarity, 10),
			});
		}

		// For each group, find the highest rarity item to use as the base
		const processed = [];
		for (const items of Object.values(grouped)) {
			// Sort by rarity descending
			items.sort((a, b) => b.rarity - a.rarity);

			const highestTier = items[0];
			const category = findMaterialCategory(highestTier.id);

			if (!category) {
				continue;
			}

			processed.push({
				id: highestTier.id,
				category,
				tiers: items.map((item, index) => ({
					tierIndex: items.length - 1 - index, // Reverse: lowest rarity = tier 0
					count: item.count,
				})),
			});
		}

		return processed;
	};

	// Helper to rebuild the helper list from storage
	const rebuildHelperList = savedHelpers => {
		const newHelpers = [];
		for (const [itemId, config] of Object.entries(savedHelpers)) {
			newHelpers.push(<FarmHelper
				key={itemId}
				category={config.category}
				config={config}
				itemId={itemId}
				materials={materials}
				onRemove={onRemove}
			/>);
		}

		return newHelpers;
	};

	const onPresetChange = event => {
		const {value} = event.target;
		const [type, presetIdString] = value.split('.');
		const presetId = Number.parseInt(presetIdString, 10);

		const preset = type === 'character'
			? presets.characters.find(c => c.id === presetId)
			: (type === 'weapon'
				? presets.weapons.find(w => w.id === presetId)
				: presets.fishingRods.find(r => r.id === presetId));

		if (!preset) {
			return;
		}

		const storageState = storage.load();
		const savedHelpers = storageState?.helpers ?? {};
		const savedPresets = storageState?.presets ?? [];

		// Determine if we're adding or removing based on current state
		const isCurrentlyActive = savedPresets.includes(value);
		const newPresets = isCurrentlyActive
			? savedPresets.filter(p => p !== value)
			: [...savedPresets, value];

		// Rebuild all preset materials from scratch based on active presets
		const presetMaterialTotals = {};

		for (const presetValue of newPresets) {
			const [presetType, presetIdString_] = presetValue.split('.');
			const id = Number.parseInt(presetIdString_, 10);
			const activePreset = presetType === 'character'
				? presets.characters.find(c => c.id === id)
				: (presetType === 'weapon'
					? presets.weapons.find(w => w.id === id)
					: presets.fishingRods.find(r => r.id === id));

			if (!activePreset) {
				continue;
			}

			const groupedItems = groupPresetItems(activePreset.items);

			for (const groupedItem of groupedItems) {
				const itemId = String(groupedItem.id);
				const {category, tiers} = groupedItem;

				presetMaterialTotals[itemId] ||= {
					category,
					tiers: {
						0: 0, 1: 0, 2: 0, 3: 0,
					},
				};

				for (const tier of tiers) {
					presetMaterialTotals[itemId].tiers[tier.tierIndex] += tier.count;
				}
			}
		}

		// Update savedHelpers to match preset totals
		// First, remove any preset-based helpers that are no longer needed
		const updatedHelpers = {...savedHelpers};

		// Remove helpers that came from presets but are no longer active
		for (const itemId of Object.keys(updatedHelpers)) {
			if (presetMaterialTotals[itemId]) {
				// This item is still needed by active presets - update its goals
				const {tiers} = presetMaterialTotals[itemId];
				const helper = updatedHelpers[itemId];

				// Update each tier goal
				const tierFields = ['tierOneGoal', 'tierTwoGoal', 'tierThreeGoal', 'tierFourGoal'];
				for (let i = 0; i < 4; i++) {
					const newGoal = tiers[i];
					helper[tierFields[i]] = newGoal > 0 ? newGoal : '';
				}
			} else {
				// This item is no longer needed by any preset
				// Remove it if all goals are empty/zero (meaning it was likely preset-added)
				const helper = updatedHelpers[itemId];
				const hasGoals = helper.tierOneGoal || helper.tierTwoGoal || helper.tierThreeGoal || helper.tierFourGoal;
				if (!hasGoals) {
					delete updatedHelpers[itemId];
				}
			}
		}

		// Add new helpers for items that don't exist yet
		for (const [itemId, {category, tiers}] of Object.entries(presetMaterialTotals)) {
			updatedHelpers[itemId] ||= {
				category,
				tierFour: 0,
				tierFourGoal: tiers[3] > 0 ? tiers[3] : '',
				tierOne: 0,
				tierOneGoal: tiers[0] > 0 ? tiers[0] : '',
				tierOneLock: false,
				tierThree: 0,
				tierThreeGoal: tiers[2] > 0 ? tiers[2] : '',
				tierThreeLock: false,
				tierTwo: 0,
				tierTwoGoal: tiers[1] > 0 ? tiers[1] : '',
				tierTwoLock: false,
			};
		}

		storage.save({...storageState, helpers: updatedHelpers, presets: newPresets});
		setActivePresets(newPresets);

		// Rebuild the helper list
		const newHelpers = rebuildHelperList(updatedHelpers);
		setFarmHelperData(newHelpers);
	};

	useEffect(() => {
		if (!didRun) {
			didRun = true;
			const storageState = storage.load();
			const savedHelpers = storageState?.helpers;
			const savedPresets = storageState?.presets ?? [];

			if (savedHelpers && Object.keys(savedHelpers).length > 0) {
				// Rebuild the entire helper list from saved state
				const newHelpers = rebuildHelperList(savedHelpers);
				setFarmHelperData(newHelpers);
			} else {
				// Storage is empty, create new
				storage.save({});
			}

			// Set presets after helpers are loaded
			setActivePresets(savedPresets);
		}
	}, [addHelperWithItem, rebuildHelperList]);

	useEffect(() => {
		const setFullScreenState = () => {
			document.fullscreenElement = fullscreenElement;
			const isFullScreen = document.fullscreenElement !== null;
			setFullScreen(isFullScreen);
		};

		// Register eventListener once
		document.addEventListener('fullscreenchange', setFullScreenState);

		return () => {
			// Unregister eventListener once
			document.removeEventListener('fullscreenchange', setFullScreenState);
		};
	}, []);

	const widthLarger768 = window?.innerWidth > 768;

	const handleWakeLock = async () => {
		if (wakeLockSentinel) {
			const releasedWakeLockSentinel = await releaseWakeLock(wakeLockSentinel);
			setWakeLockSentinel(releasedWakeLockSentinel);
		} else {
			const requestedWakeLockSentinel = await requestWakeLock(wakeLockSentinel);
			setWakeLockSentinel(requestedWakeLockSentinel);
		}
	};

	const handleFullscreen = () => {
		toggleFullscreen();
	};

	const hasItems = farmHelperList.length > 0;

	const handleFloatChange = () => {
		setFloatGroups(!floatGroups);
	};

	const disabledKeys = farmHelperData.map(item => item.itemId);

	const videoBackground
		= (
			<div css={video}>
				<video disablePictureInPicture disableRemotePlayback autoPlay loop muted poster='https://genshin.hoyoverse.com/_nuxt/img/poster.47f71d4.jpg'>
					<source src='https://genshin.hoyoverse.com/_nuxt/videos/bg.3e78e80.mp4' type='audio/mp4'/>
				</video>
			</div>
		);

	const stackToggle = (
		<button
			className='material-symbols-outlined'
			css={[actions, toggleFloat]}
			title={floatGroups ? 'Click to stack items' : 'Click to float items'}
			type='button'
			onClick={handleFloatChange}
		>
			{floatGroups ? 'full_stacked_bar_chart' : 'stacked_bar_chart'}
		</button>
	);

	return (
		<>
			<Global styles={globalStyles}/>
			{widthLarger768 ? videoBackground : null}
			<main>
				{!widthLarger768 && (
					<button
						className='material-symbols-outlined'
						css={[actions, metaKeys, toggleWakeLock]}
						title={wakeLockSentinel ? 'Allow screen to sleep' : 'Keep screen awake'}
						type='button'
						onClick={handleWakeLock}
					>
						{wakeLockSentinel ? 'bedtime' : 'bedtime_off'}
					</button>
				)}
				<button
					className='material-symbols-outlined'
					css={[actions, metaKeys, toggleFullScreen]}
					title={fullScreen ? 'Exit fullscreen' : 'Make fullscreen'}
					type='button'
					onClick={handleFullscreen}
				>
					{fullScreen ? 'fullscreen_exit' : 'fullscreen'}
				</button>
				{hasItems ? stackToggle : null}
				<div css={floatGroups ? helperList : undefined}>
					{farmHelperList}
					{hasItems ? <><section/><section/><section/><section/><section/><section/></> : null}
				</div>
				<ItemCategories list={disabledKeys} materials={materialsRare} onChangeProp={onChange}/>
			</main>
			<button
				css={fab}
				type='button'
				title='Add preset'
				aria-label='Add preset'
				onClick={() => setIsPresetModalOpen(true)}
			>
				+
			</button>
			<PresetModal
				isOpen={isPresetModalOpen}
				activePresets={activePresets}
				onClose={() => setIsPresetModalOpen(false)}
				onPresetChange={onPresetChange}
			/>
		</>
	);
}
