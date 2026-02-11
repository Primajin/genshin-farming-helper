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
	const farmHelperList = farmHelperData.map(({itemId, config, category}) => {
		// Create a key that includes the goal values to force re-mount when presets change them
		const goalKey = `${config?.tierOneGoal || ''}-${config?.tierTwoGoal || ''}-${config?.tierThreeGoal || ''}-${config?.tierFourGoal || ''}`;
		const key = `${itemId}-${goalKey}`;

		return (
			<FarmHelper
				key={key}
				category={category}
				config={config}
				itemId={itemId}
				materials={materials}
				onRemove={onRemove}
			/>
		);
	});

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

		// If item already exists, don't add duplicate
		if (savedHelpers[itemId]) {
			return;
		}

		// Create default config if not provided
		const defaultConfig = config || {
			category,
			tierFour: 0,
			tierFourGoal: '',
			tierOne: 0,
			tierOneGoal: '',
			tierOneLock: false,
			tierThree: 0,
			tierThreeGoal: '',
			tierThreeLock: false,
			tierTwo: 0,
			tierTwoGoal: '',
			tierTwoLock: false,
		};

		const newHelpers = {...savedHelpers, [itemId]: defaultConfig};
		storage.save({...storageState, helpers: newHelpers});

		setFarmHelperData(previousHelpers =>
			[
				...previousHelpers,
				{itemId, config: defaultConfig, category},
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
			// Check if items have different rarities (indicating tiers of same material)
			const uniqueRarities = new Set(items.map(item => item.rarity));
			const hasDifferentRarities = uniqueRarities.size > 1;

			if (hasDifferentRarities) {
				// Sort by rarity descending
				items.sort((a, b) => b.rarity - a.rarity);

				const highestTier = items[0];
				const lowestTier = items.at(-1);
				const category = findMaterialCategory(highestTier.id);

				if (!category) {
					continue;
				}

				processed.push({
					id: lowestTier.id, // Use lowest tier ID as the canonical key
					category,
					tiers: items.map((item, index) => ({
						tierIndex: items.length - 1 - index, // Reverse: lowest rarity = tier 0
						count: item.count,
					})),
				});
			} else {
				// All items have same rarity - treat as separate materials
				for (const item of items) {
					const category = findMaterialCategory(item.id);
					if (!category) {
						continue;
					}

					processed.push({
						id: item.id,
						category,
						tiers: [{
							tierIndex: 0,
							count: item.count,
						}],
					});
				}
			}
		}

		return processed;
	};

	// Helper to rebuild the helper list from storage
	const rebuildHelperList = useCallback(savedHelpers => {
		const newHelpers = [];
		for (const [itemId, config] of Object.entries(savedHelpers)) {
			newHelpers.push({
				itemId,
				config,
				category: config.category,
			});
		}

		return newHelpers;
	}, []);

	// Helper to find preset by type and ID
	const findPreset = useCallback((type, id) => {
		if (type === 'character') {
			return presets.characters.find(c => c.id === id);
		}

		if (type === 'weapon') {
			return presets.weapons.find(w => w.id === id);
		}

		return presets.fishingRods.find(r => r.id === id);
	}, []);

	// Helper to find if any tier of a material exists in helpers
	const findExistingHelperForMaterial = (savedHelpers, materialId) => {
		const materialIdString = String(materialId);

		// First check exact match
		if (savedHelpers[materialIdString]) {
			return {itemId: materialIdString, helper: savedHelpers[materialIdString]};
		}

		// For multi-tier materials, check all tiers
		// Multi-tier materials have consecutive IDs (e.g., 104101, 104102, 104103, 104104)
		const material = findMaterial(materialId);
		if (!material) {
			return null;
		}

		const {sortRank} = material;
		const allMaterials = getAllMaterialsFlat();
		const sameMaterialTiers = allMaterials.filter(m => m.sortRank === sortRank);

		// Sort by ID to check for consecutive sequences
		sameMaterialTiers.sort((a, b) => a.id - b.id);

		// Check if IDs are consecutive (indicating tiers of same material)
		// Tiered materials: 104101, 104102, 104103, 104104 (diff = 1)
		// Separate items: 131046, 131047, 131048 might not be consecutive or might have gaps
		const ids = sameMaterialTiers.map(m => m.id);
		let isConsecutive = true;
		for (let i = 1; i < ids.length; i++) {
			if (ids[i] - ids[i - 1] !== 1) {
				isConsecutive = false;
				break;
			}
		}

		// Only check other tiers if IDs are consecutive (multi-tier material)
		if (!isConsecutive || ids.length === 1) {
			return null;
		}

		// This is a multi-tier material, check all tiers
		for (const tierMaterial of sameMaterialTiers) {
			const tierId = String(tierMaterial.id);
			if (tierId !== materialIdString && savedHelpers[tierId]) {
				return {itemId: tierId, helper: savedHelpers[tierId]};
			}
		}

		return null;
	};

	const onPresetChange = useCallback(event => {
		const {value} = event.target;
		const [type, presetIdString] = value.split('.');
		const presetId = Number.parseInt(presetIdString, 10);

		const preset = findPreset(type, presetId);
		if (!preset) {
			return;
		}

		const storageState = storage.load();
		const savedPresets = storageState?.presets ?? [];

		// Toggle preset active state
		const isCurrentlyActive = savedPresets.includes(value);
		const newPresets = isCurrentlyActive
			? savedPresets.filter(p => p !== value)
			: [...savedPresets, value];

		// Save the updated preset list
		storage.save({...storageState, presets: newPresets});
		setActivePresets(newPresets);

		// Toggle preset: add or subtract goals
		if (isCurrentlyActive) {
			// Deactivating preset - subtract goals
			const groupedItems = groupPresetItems(preset.items);

			for (const groupedItem of groupedItems) {
				const storageState = storage.load();
				const savedHelpers = storageState?.helpers ?? {};
				const existing = findExistingHelperForMaterial(savedHelpers, groupedItem.id);

				if (existing) {
					const tierFields = ['tierOneGoal', 'tierTwoGoal', 'tierThreeGoal', 'tierFourGoal'];
					const updatedConfig = {...existing.helper};

					for (const tier of groupedItem.tiers) {
						const currentGoal = existing.helper[tierFields[tier.tierIndex]] || 0;
						const newGoal = Math.max(0, currentGoal - tier.count);
						updatedConfig[tierFields[tier.tierIndex]] = newGoal === 0 ? '' : newGoal;
					}

					// Check if there's any progress or remaining goals
					const hasProgress = updatedConfig.tierOne || updatedConfig.tierTwo
						|| updatedConfig.tierThree || updatedConfig.tierFour;
					const hasAnyGoal = updatedConfig.tierOneGoal || updatedConfig.tierTwoGoal
						|| updatedConfig.tierThreeGoal || updatedConfig.tierFourGoal;

					if (!hasProgress && !hasAnyGoal) {
						// Remove the helper entirely
						delete savedHelpers[existing.itemId];
						storage.save({...storageState, helpers: savedHelpers});
						setFarmHelperData(previousHelpers =>
							previousHelpers.filter(h => h.itemId !== existing.itemId));
					} else {
						// Update with reduced goals
						const newHelpers = {...savedHelpers, [existing.itemId]: updatedConfig};
						storage.save({...storageState, helpers: newHelpers});

						// Update the UI by rebuilding helpers
						const rebuilt = rebuildHelperList(newHelpers);
						setFarmHelperData(rebuilt);
					}
				}
			}
		} else {
			// Activating preset - add goals
			const groupedItems = groupPresetItems(preset.items);

			// Add each material using the standard addHelperWithItem flow
			for (const groupedItem of groupedItems) {
				const itemId = String(groupedItem.id);
				const {category, tiers} = groupedItem;

				// Check if ANY tier of this material already exists
				const storageState = storage.load();
				const savedHelpers = storageState?.helpers ?? {};
				const existing = findExistingHelperForMaterial(savedHelpers, groupedItem.id);

				if (existing) {
					// Item exists - update goals by adding preset amounts
					const tierFields = ['tierOneGoal', 'tierTwoGoal', 'tierThreeGoal', 'tierFourGoal'];
					const updatedConfig = {...existing.helper};

					for (const tier of tiers) {
						const currentGoal = existing.helper[tierFields[tier.tierIndex]] || 0;
						const newGoal = currentGoal + tier.count;
						updatedConfig[tierFields[tier.tierIndex]] = newGoal;
					}

					// Save the updated config using the EXISTING itemId
					const newHelpers = {...savedHelpers, [existing.itemId]: updatedConfig};
					storage.save({...storageState, helpers: newHelpers});

					// Update the UI by rebuilding helpers
					const rebuilt = rebuildHelperList(newHelpers);
					setFarmHelperData(rebuilt);
				} else {
					// Item doesn't exist - create new helper with preset goals
					const config = {
						category,
						tierFour: 0,
						tierFourGoal: tiers.find(t => t.tierIndex === 3)?.count || '',
						tierOne: 0,
						tierOneGoal: tiers.find(t => t.tierIndex === 0)?.count || '',
						tierOneLock: false,
						tierThree: 0,
						tierThreeGoal: tiers.find(t => t.tierIndex === 2)?.count || '',
						tierThreeLock: false,
						tierTwo: 0,
						tierTwoGoal: tiers.find(t => t.tierIndex === 1)?.count || '',
						tierTwoLock: false,
					};

					addHelperWithItem({itemId, config, category});
				}
			}
		}
	}, [findPreset, groupPresetItems, addHelperWithItem, rebuildHelperList, findMaterial, getAllMaterialsFlat, findExistingHelperForMaterial]);

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

	const disabledKeys = farmHelperData.flatMap(item => {
		const {itemId} = item;
		const material = findMaterial(Number.parseInt(itemId, 10));

		if (!material) {
			return [itemId];
		}

		// For multi-tier materials, disable all tiers
		const {sortRank} = material;
		const allMaterials = getAllMaterialsFlat();
		const sameMaterialTiers = allMaterials.filter(m => m.sortRank === sortRank);

		// Check if IDs are consecutive (indicating tiers of same material)
		sameMaterialTiers.sort((a, b) => a.id - b.id);
		const ids = sameMaterialTiers.map(m => m.id);
		let isConsecutive = true;
		for (let i = 1; i < ids.length; i++) {
			if (ids[i] - ids[i - 1] !== 1) {
				isConsecutive = false;
				break;
			}
		}

		// Only disable all tiers if IDs are consecutive (multi-tier material)
		if (isConsecutive && ids.length > 1) {
			return sameMaterialTiers.map(m => String(m.id));
		}

		// Otherwise only disable this specific item
		return [itemId];
	});

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
					{hasItems ? Array.from({length: 6}, (_, index) => <section key={`spacer-${index}`}/>) : null}
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
