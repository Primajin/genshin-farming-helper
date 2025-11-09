/* global window, document */
/** @jsxImportSource @emotion/react */
import {useCallback, useEffect, useState} from 'react';
import {Global, css} from '@emotion/react';

import materials from '../data.json';
import materialsRare from '../data-rare.json';
import presets from '../presets.json';
import storage from '../utils/local-storage.js';
import theme from '../theme/index.js';
import {breakpoints, up} from '../utils/theming.js';
import {fullscreenElement, toggleFullscreen} from '../utils/fullscreen.js';
import {releaseWakeLock, requestWakeLock} from '../utils/wake-lock.js';
import ItemCategories from './item-categories.jsx';
import PresetCategories from './preset-categories.jsx';
import FarmHelper from './farm-helper.jsx';

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

	// Helper to find material category by ID
	const findMaterialCategory = materialId => {
		const allMaterialsFlat = [
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

		const material = allMaterialsFlat.find(m => m.id === materialId);
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

	const onPresetChange = event => {
		const {checked, value} = event.target;
		const [type, presetIdString] = value.split('.');
		const presetId = Number.parseInt(presetIdString, 10);

		const preset = type === 'character'
			? presets.characters.find(c => c.id === presetId)
			: presets.weapons.find(w => w.id === presetId);

		if (!preset) {
			return;
		}

		const storageState = storage.load();
		const savedHelpers = storageState?.helpers ?? {};
		const savedPresets = storageState?.presets ?? [];

		if (checked) {
			// Add preset
			const newPresets = [...savedPresets, value];
			setActivePresets(newPresets);

			// Add or update goals for each material in the preset
			for (const item of preset.items) {
				const itemId = String(item.id);
				const category = findMaterialCategory(item.id);

				if (!category) {
					continue;
				}

				if (savedHelpers[itemId]) {
					// Material already tracked - update goals
					const config = savedHelpers[itemId];
					const goalFields = ['tierOneGoal', 'tierTwoGoal', 'tierThreeGoal', 'tierFourGoal'];

					for (const goalField of goalFields) {
						const currentGoal = config[goalField] || 0;
						config[goalField] = currentGoal + item.count;
					}

					savedHelpers[itemId] = config;
				} else {
					// New material - add with goal set
					const config = {
						category,
						tierFour: 0,
						tierFourGoal: item.count,
						tierOne: 0,
						tierOneGoal: item.count,
						tierOneLock: false,
						tierThree: 0,
						tierThreeGoal: item.count,
						tierThreeLock: false,
						tierTwo: 0,
						tierTwoGoal: item.count,
						tierTwoLock: false,
					};
					savedHelpers[itemId] = config;
					addHelperWithItem({itemId, config, category});
				}
			}

			storage.save({...storageState, helpers: savedHelpers, presets: newPresets});
			// Force re-render by updating state
			setFarmHelperList(previousHelpers => [...previousHelpers]);
		} else {
			// Remove preset
			const newPresets = savedPresets.filter(p => p !== value);
			setActivePresets(newPresets);

			// Reduce or remove goals for each material in the preset
			for (const item of preset.items) {
				const itemId = String(item.id);

				if (savedHelpers[itemId]) {
					const config = savedHelpers[itemId];
					const goalFields = ['tierOneGoal', 'tierTwoGoal', 'tierThreeGoal', 'tierFourGoal'];

					for (const goalField of goalFields) {
						const currentGoal = config[goalField] || 0;
						const newGoal = Math.max(0, currentGoal - item.count);
						config[goalField] = newGoal === 0 ? '' : newGoal;
					}

					savedHelpers[itemId] = config;
				}
			}

			storage.save({...storageState, helpers: savedHelpers, presets: newPresets});
			// Force re-render by updating state
			setFarmHelperList(previousHelpers => [...previousHelpers]);
		}
	};

	useEffect(() => {
		if (!didRun) {
			didRun = true;
			const storageState = storage.load();
			const savedHelpers = storageState?.helpers;
			const savedPresets = storageState?.presets ?? [];

			if (savedHelpers && Object.keys(savedHelpers).length > 0) {
				for (const [itemId, config] of Object.entries(savedHelpers)) {
					// eslint-disable-next-line react-hooks/set-state-in-effect
					addHelperWithItem({itemId, config, category: config.category});
				}
			} else {
				// Storage is empty, create new
				storage.save({});
			}

			// Set presets after helpers are loaded
			setActivePresets(savedPresets);
		}
	}, [addHelperWithItem]);

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
				<PresetCategories activePresets={activePresets} onChangeProp={onPresetChange}/>
				<ItemCategories list={disabledKeys} materials={materialsRare} onChangeProp={onChange}/>
			</main>
		</>
	);
}
