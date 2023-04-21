/* global window */
/** @jsxImportSource @emotion/react */
import {useCallback, useEffect, useState} from 'react';
import {Global, css} from '@emotion/react';

import storage from '../utils/local-storage.js';
import materials from '../data.json';
import materialsRare from '../data-rare.json';
import FarmHelper from './farm-helper.jsx';
import ItemCategories from './item-categories.jsx';

const globalStyles = css`
	body {
		background: transparent top center url("https://genshin.hoyoverse.com/_nuxt/img/47f71d4.jpg") no-repeat fixed;
		background-size: cover;
		margin: 0;
		padding: 0;
		font-family: sans-serif;
		text-align: center;
		user-select: none;
	}

	.material-icons {
		cursor: pointer;
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
		max-width: 396px;
		transform: translateX(-50%);
		padding: 15px 0;
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

let didRun = false;

export default function Main() {
	const [farmHelperList, setFarmHelperList] = useState([]);

	const onRemove = name => {
		const savedHelpers = storage.load();
		storage.save(savedHelpers.filter(savedHelper => savedHelper.split('.')[1] !== name));
		setFarmHelperList(previousHelpers => previousHelpers.filter(previousHelper => previousHelper.key !== name));
	};

	const addHelperWithItem = useCallback(itemName => {
		const category = itemName.split('.')[0];
		const item = itemName.split('.')[1];
		const savedHelpers = new Set(storage.load());
		savedHelpers.add(itemName);
		console.log('savedHelpers', savedHelpers);
		storage.save(Array.from(savedHelpers));
		setFarmHelperList(
			previousHelpers =>
				[
					...previousHelpers,
					<FarmHelper
						key={item}
						category={category}
						item={item}
						materials={materials}
						onRemove={onRemove}
					/>,
				],
		);
	}, []);

	const onChange = event => {
		addHelperWithItem(event.target.value);
	};

	useEffect(() => {
		if (!didRun) {
			didRun = true;
			const savedHelpers = storage.load();
			if (Array.isArray(savedHelpers) && savedHelpers.length > 0) {
				for (const helper of savedHelpers) {
					addHelperWithItem(helper);
				}
			} else {
				storage.save([]);
			}
		}
	}, [addHelperWithItem]);

	const showVideo = window?.innerWidth > 768;
	const disabledKeys = farmHelperList.map(item => item.key);

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
				{farmHelperList}
				<ItemCategories list={disabledKeys} materials={materialsRare} onChangeProp={onChange}/>
			</main>
		</>
	);
}
