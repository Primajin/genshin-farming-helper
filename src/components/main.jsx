/* global window */
/** @jsxImportSource @emotion/react */
import {materials} from 'genshin-db';
import {useCallback, useEffect, useState} from 'react';
import {Global, css} from '@emotion/react';

import storage, {fromLocalStorage} from '../utils/local-storage.js';
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

const localStorageKey = 'genshin-farming-helper';
let didRun = false;

export default function Main() {
	const defaultOptions = {matchCategories: true, verboseCategories: true};
	const sundayDrops = materials('Sunday', defaultOptions).sort((a, b) => a.sortorder - b.sortorder);

	const talentMaterials = sundayDrops.filter(material => material?.materialtype.startsWith('Talent'));
	const talentMaterialsRare = talentMaterials.filter(material => Number.parseInt(material?.rarity, 10) > 3);

	const weaponMaterials = sundayDrops.filter(material => material?.materialtype.startsWith('Weapon'));
	const weaponMaterialsRare = weaponMaterials.filter(material => Number.parseInt(material?.rarity, 10) > 4);

	const characterMaterials = materials('names', defaultOptions).filter(material => material?.materialtype.startsWith('Character Level-Up Material') || material?.materialtype.startsWith('Local')).sort((a, b) => a.sortorder - b.sortorder);

	const characterAscensionMaterials = characterMaterials.filter(material => material?.description.startsWith('Character Ascension'));
	const characterAscensionMaterialsRare = characterAscensionMaterials.filter(material => Number.parseInt(material?.rarity, 10) > 4);

	const characterLVLMaterials = characterMaterials.filter(material => !material?.description.startsWith('Character Ascension'));
	const characterLVLMaterialsRare = characterLVLMaterials.filter(material => {
		const rarityInt = Number.parseInt(material?.rarity, 10);
		return rarityInt > 2 ? (rarityInt === 3 ? !material.source.includes('Stardust Exchange') : true) : false;
	});

	const localSpecialties = characterMaterials.filter(material => material?.materialtype.startsWith('Local'));

	const materialsAll = {
		talentMaterials,
		weaponMaterials,
		characterAscensionMaterials,
		characterLVLMaterials,
		localSpecialties,
	};

	const materialsRare = {
		talentMaterials: talentMaterialsRare,
		weaponMaterials: weaponMaterialsRare,
		characterAscensionMaterials: characterAscensionMaterialsRare,
		characterLVLMaterials: characterLVLMaterialsRare,
		localSpecialties,
	};

	const [farmHelperList, setFarmHelperList] = useState([]);

	const onRemove = name => {
		const savedHelpers = storage.get(localStorageKey);
		storage.set(localStorageKey, savedHelpers.filter(savedHelper => savedHelper.split('.')[1] !== name));
		setFarmHelperList(previousHelpers => previousHelpers.filter(previousHelper => previousHelper.key !== name));
	};

	const addHelperWithItem = useCallback(itemName => {
		const category = itemName.split('.')[0];
		const item = itemName.split('.')[1];
		const savedHelpers = new Set(storage.get(localStorageKey));
		savedHelpers.add(itemName);
		storage.set(localStorageKey, Array.from(savedHelpers));
		setFarmHelperList(
			previousHelpers =>
				[
					...previousHelpers,
					<FarmHelper
						key={item}
						category={category}
						item={item}
						materials={materialsAll}
						onRemove={onRemove}
					/>,
				],
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onChange = event => {
		addHelperWithItem(event.target.value);
	};

	useEffect(() => {
		if (!didRun) {
			didRun = true;
			const savedHelpers = storage.get(localStorageKey);
			if (Array.isArray(savedHelpers)) {
				for (const helper of savedHelpers) {
					addHelperWithItem(helper);
				}
			} else {
				fromLocalStorage.setItem(localStorageKey, '[]');
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
