/** @jsxImportSource @emotion/react */
import PropTypes from 'prop-types';
import genshinDB from 'genshin-db';
import {css} from '@emotion/react';
import {useEffect, useState} from 'react';

import {backgrounds, drops, IMG_URL, materialTypes, nameKeys} from '../constants';
import theme from '../theme';

const wrapper = css`
	display: inline-block;
	height: 130px;
	margin: 2px;
	position: relative;
	vertical-align: top;
	width: 75px;
`;

const button = css`
	background: ${theme.primary} top center no-repeat;
	background-size: contain;
	border-radius: 7px;
	border: 0 solid transparent;
	cursor: pointer;
	height: 95px;
	padding: 0;
	position: relative;
	text-align: center;

	&::after {
		background-image: radial-gradient(circle at 0 0, rgba(255,0,0,0) 20px, ${theme.primary} 21px);
		content: "";
		display: block;
		height: 20px;
		position: absolute;
		right: 0;
		top: 75px;
		transform: translateY(-100%);
		width: 20px;
	}

	> * {
		pointer-events: none;
	}
`;

const actions = css`
	background: ${theme.primary};
	border-radius: 50%;
	margin-top: 3px;
	padding: 3px;
`;

const removeButton = css`
	margin: 30px 0 0 25px;
`;

function FarmHelper({category, item, onRemove}) {
	let items = [];
	let itemNames;
	let dropsIndex = 0;
	switch (category) {
		case materialTypes.TALENT: {
			itemNames = nameKeys.map(key => genshinDB.talentmaterialtypes(item)[key]);
			items = itemNames.filter(Boolean).map(name => genshinDB.materials(name));
			break;
		}

		case materialTypes.WEAPON: {
			itemNames = nameKeys.map(key => genshinDB.weaponmaterialtypes(item)[key]);
			items = itemNames.filter(Boolean).map(name => genshinDB.materials(name));
			break;
		}

		case materialTypes.LEVEL: {
			dropsIndex = drops.indexOf(item);
			items = dropsIndex > 0 ? [genshinDB.materials(drops[dropsIndex - 2]), genshinDB.materials(drops[dropsIndex - 1]), genshinDB.materials(drops[dropsIndex])] : [genshinDB.materials(item)];
			break;
		}

		default: {
			itemNames = item.split(' ')[0];
			items = genshinDB
				.materials('names', {matchCategories: true, verboseCategories: true})
				.filter(item => item.name.includes(itemNames))
				.sort((a, b) => a.sortorder - b.sortorder).reverse();
			break;
		}
	}

	const hasJustOne = items.length === 1;
	const hasTierFour = items.length > 3;

	const [tierOne, setTierOne] = useState(0);
	const [lockTierOne, setLockTierOne] = useState(hasJustOne);
	const [tierTwo, setTierTwo] = useState(0);
	const [lockTierTwo, setLockTierTwo] = useState(false);
	const [tierThree, setTierThree] = useState(0);
	const [lockTierThree, setLockTierThree] = useState(false);
	const [tierFour, setTierFour] = useState(0);

	const incTierOne = () => {
		setTierOne(tierOne + 1);
	};

	const incTierTwo = () => {
		setTierTwo(tierTwo + 1);
	};

	const incTierThree = () => {
		setTierThree(tierThree + 1);
	};

	const incTierFour = () => {
		setTierFour(tierFour + 1);
	};

	const incTier = [incTierOne, incTierTwo, incTierThree, incTierFour];
	const setLockTier = [setLockTierOne, setLockTierTwo, setLockTierThree];
	const lockedTier = [lockTierOne, lockTierTwo, lockTierThree];
	const tierValue = [tierOne, tierTwo, tierThree, tierFour];

	useEffect(() => {
		if (!lockTierOne && tierOne && tierOne / 3 >= 1) {
			setTierTwo(Math.floor(tierOne / 3) + tierTwo);
			setTierOne(tierOne % 3);
		}
	}, [lockTierOne, tierOne, tierTwo]);

	useEffect(() => {
		if (!lockTierTwo && tierTwo && tierTwo / 3 >= 1) {
			setTierThree(Math.floor(tierTwo / 3) + tierThree);
			setTierTwo(tierTwo % 3);
		}
	}, [lockTierTwo, tierTwo, tierThree]);

	useEffect(() => {
		if (!lockTierThree && hasTierFour && tierThree && tierThree / 3 >= 1) {
			setTierFour(Math.floor(tierThree / 3) + tierFour);
			setTierThree(tierThree % 3);
		}
	}, [lockTierThree, hasTierFour, tierThree, tierFour]);

	return (
		<section>
			{items.map((item, itemIndex) => (
				<div key={item.name} css={wrapper}>
					<button
						css={button}
						style={{backgroundImage: `url(${backgrounds[item.rarity - 1]})`}}
						title={item.name}
						type='button'
						onClick={incTier[itemIndex]}
					>
						<img alt={item.name} src={`${IMG_URL}${item.images?.nameicon}.png`} width='75' height='75'/>
						<b>{tierValue[itemIndex]}</b>
					</button>
					{itemIndex < items.length - 1 && (
						<label>
							<input
								type='checkbox'
								checked={lockedTier[itemIndex]}
								onChange={() => setLockTier[itemIndex](!lockedTier[itemIndex])}
							/>
							<div css={actions} className='material-icons'>
								{lockedTier[itemIndex] ? 'lock' : 'lock_open'}
							</div>
						</label>
					)}
				</div>
			))}
			<div css={[actions, removeButton]} className='material-icons' onClick={() => onRemove(item)}>delete</div>
		</section>
	);
}

FarmHelper.propTypes = {
	category: PropTypes.string,
	item: PropTypes.string,
	onRemove: PropTypes.func,
};

FarmHelper.defaultProps = {
	category: materialTypes.ASCENSION,
	item: 'Agnidus Agate',
	onRemove() {},
};

export default FarmHelper;
