/* global window */
/** @jsxImportSource @emotion/react */
import {useCallback, useEffect, useState} from 'react';
import {Global, css} from '@emotion/react';

import materials from '../data.json';
import materialsRare from '../data-rare.json';
import storage from '../utils/local-storage.js';
import theme from '../theme/index.js';
import {breakpoints, up} from '../utils/theming.js';
import ItemCategories from './item-categories.jsx';
import FarmHelper from './farm-helper.jsx';

const globalStyles = css`
	*, *::before, *::after {
		box-sizing: border-box;
	}
	
	body {
		background: transparent top center url("https://genshin.hoyoverse.com/_nuxt/img/47f71d4.jpg") no-repeat fixed;
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

const helperList = css`
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;

		${up('md')} {
			justify-content: space-between;
		};
`;

let didRun = false;
const {actions} = theme;

export default function Main() {
	const [farmHelperList, setFarmHelperList] = useState([]);
	const [floatGroups, setFloatGroups] = useState(false);

	const onRemove = name => {
		const savedHelpers = storage.load();
		for (const key of Object.keys(savedHelpers)) {
			if (key.split('.')[1] === name) {
				delete savedHelpers[key];
			}
		}

		storage.save(savedHelpers);
		setFarmHelperList(previousHelpers => previousHelpers.filter(previousHelper => previousHelper.key !== name));
	};

	/**
	 * The config array has seven positions
	 * @typedef ConfigArray
	 * @type {array}
	 * @property {number}		0=0			low quality amount
	 * @property {boolean}	1=false	low quality lock
	 * @property {number}		2=0			mid quality amount
	 * @property {boolean}	3=false	mid quality lock
	 * @property {number}		4=0			high quality amount
	 * @property {boolean}	5=false	high quality lock
	 * @property {boolean}	6=0			super quality amount
	 */

	/**
	 * Add a new helper with given Item
	 * @type {(function({[config]: ConfigArray, itemName: string}): void)|*}
	 */
	const addHelperWithItem = useCallback(helper => {
		const {config = [0, false, 0, false, 0, false, 0], itemName} = helper;
		const savedHelpers = storage.load();

		const newHelpers = {...savedHelpers, [itemName]: config};
		storage.save(newHelpers);

		const category = itemName.split('.')[0];
		const item = itemName.split('.')[1];
		setFarmHelperList(
			previousHelpers =>
				[
					...previousHelpers,
					<FarmHelper
						key={item}
						category={category}
						config={config}
						item={item}
						materials={materials}
						onRemove={onRemove}
					/>,
				],
		);
	}, []);

	const onChange = event => {
		addHelperWithItem({itemName: event.target.value});
	};

	useEffect(() => {
		if (!didRun) {
			didRun = true;
			const savedHelpers = storage.load();
			if (savedHelpers && Object.keys(savedHelpers).length > 0) {
				for (const [key, value] of Object.entries(savedHelpers)) {
					addHelperWithItem({itemName: key, config: value});
				}
			} else {
				// Storage is empty, create new
				storage.save({});
			}
		}
	}, [addHelperWithItem]);

	const showVideo = window?.innerWidth > 768;
	const disabledKeys = farmHelperList.map(item => item.key);
	const hasItems = farmHelperList.length > 0;

	const handleFloatChange = () => {
		setFloatGroups(!floatGroups);
	};

	return (
		<>
			<Global styles={globalStyles}/>
			{showVideo && (
				<div css={video}>
					<video autoPlay='autoplay' poster='https://genshin.hoyoverse.com/_nuxt/img/47f71d4.jpg' loop='loop' muted='muted'>
						<source src='https://genshin.hoyoverse.com/_nuxt/videos/3e78e80.mp4' type='audio/mp4'/>
					</video>
				</div>
			)}
			<main>
				{hasItems && (
					<button
						className='material-symbols-outlined'
						css={[actions, toggleFloat]}
						type='button'
						onClick={handleFloatChange}
					>
						{floatGroups ? 'full_stacked_bar_chart' : 'stacked_bar_chart'}
					</button>
				)}
				<div css={floatGroups ? helperList : undefined}>
					{farmHelperList}
					{hasItems && <><section/><section/><section/><section/><section/><section/></>}
				</div>
				<ItemCategories list={disabledKeys} materials={materialsRare} onChangeProp={onChange}/>
			</main>
		</>
	);
}
