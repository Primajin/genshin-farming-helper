/** @jsxImportSource @emotion/react */
import PropTypes from 'prop-types';
import {css} from '@emotion/react';
import {useEffect, useState} from 'react';

import storage from '../utils/local-storage.js';
import theme from '../theme';
import {
	backgrounds, IMG_URL, IMG_URL2, materialTypes,
} from '../constants';
import {helpersType, materialsType} from '../types';
import {up} from '../utils/theming.js';

const {actions, primary} = theme;

const wrapper = css`
	display: inline-block;
	margin: 2px;
	position: relative;
	vertical-align: top;
	width: 75px;
`;

const label = css`
	display: inline-block;
	margin-bottom: 5px;
	overflow: hidden;
	position: relative;
`;

const input = css`
	display: block;
	margin: 7px auto 6px;
	position: absolute;
	left: -5em;
	width: 46px;

	&:focus {
		position: static;

		+ div {
			display: none;
		}
	}
`;

const button = css`
	background: ${primary} top center no-repeat;
	background-size: contain;
	border-radius: 7px;
	border: 0 solid transparent;
	color: #4a5566;
	cursor: pointer;
	height: 95px;
	padding: 0;
	position: relative;
	text-align: center;

	&::after {
		background-image: radial-gradient(circle at 0 0, rgba(255, 0, 0, 0) 20px, ${primary} 21px);
		content: "";
		display: block;
		height: 20px;
		position: absolute;
		right: 0;
		top: 76px;
		transform: translateY(-100%);
		width: 20px;
	}

	&[data-goal] {
		&::before {
			background: #c2fd5e;
			border-radius: 0 7px 0 7px;
			color: #343432;
			content: attr(data-goal);
			font-weight: bold;
			min-width: 20px;
			padding: 2px;
			position: absolute;
			top: 0;
			right: 0;
		}
	}

	> * {
		pointer-events: none;
	}

	> img {
		display: inline-block;
	}
`;

const rarity = css`
	bottom: 12px;
	color: #fdc950;
	left: 50%;
	position: absolute;
	text-shadow: 0 0 3px rgba(50, 0, 0, 0.65);
	transform: translateX(-50%);
	white-space: nowrap;
	z-index: 1;

	> span {
		font-size: 15px;
		letter-spacing: -2pt;
	}
`;

const removeButton = css`
	font-size: 25px;
	padding: 0;
	margin: 75px 0 0 25px;

	${up('md')} {
		margin-left: 10px;
	};
`;

const reachedGoal = css`
	color: #347d39;
`;

function FarmHelper({
	category,
	config = {},
	itemId,
	materials: {
		buildingMaterials,
		characterAscensionMaterials,
		characterLVLMaterials,
		characterWeaponEnhancementMaterials,
		fish,
		localSpecialties,
		talentMaterials,
		weaponMaterials,
		wood,
	},
	onRemove,
}) {
	const materials = [
		...buildingMaterials,
		...characterAscensionMaterials,
		...characterLVLMaterials,
		...characterWeaponEnhancementMaterials,
		...fish,
		...localSpecialties,
		...talentMaterials,
		...weaponMaterials,
		...wood,
	];

	const materialId = Number.parseInt(itemId, 10);
	const rawItem = materials.find(material => material.id === materialId);

	const multipleItem = category === materialTypes.ENHANCEMENT || category === materialTypes.WEAPON || category === materialTypes.TALENT || category === materialTypes.ASCENSION;
	const items = multipleItem ? materials.filter(material => material.sortRank === rawItem.sortRank) : [rawItem];

	// 1
	const hasJustOne = items.length === 1;
	const [tierOne, setTierOne] = useState(config.tierOne ?? 0);
	const [tierOneLock, setTierOneLock] = useState(config.tierOneLock || hasJustOne);
	const [tierOneGoal, setTierOneGoal] = useState(config.tierOneGoal ?? '');
	const incrementTierOne = () => setTierOne(tierOne + 1);

	// 2
	const [tierTwo, setTierTwo] = useState(config.tierTwo ?? 0);
	const [tierTwoLock, setTierTwoLock] = useState(config.tierTwoLock ?? false);
	const [tierTwoGoal, setTierTwoGoal] = useState(config.tierTwoGoal ?? '');
	const incrementTierTwo = () => setTierTwo(tierTwo + 1);
	useEffect(() => {
		if (!tierOneLock && tierOne && tierOne / 3 >= 1) {
			setTierTwo(Math.floor(tierOne / 3) + tierTwo);
			setTierOne(tierOne % 3);
		}
	}, [tierOneLock, tierOne, tierTwo]);

	// 3
	const [tierThree, setTierThree] = useState(config.tierThree ?? 0);
	const [tierThreeLock, setTierThreeLock] = useState(config.tierThreeLock ?? false);
	const [tierThreeGoal, setTierThreeGoal] = useState(config.tierThreeGoal ?? '');
	const incrementTierThree = () => setTierThree(tierThree + 1);
	useEffect(() => {
		if (!tierTwoLock && tierTwo && tierTwo / 3 >= 1) {
			setTierThree(Math.floor(tierTwo / 3) + tierThree);
			setTierTwo(tierTwo % 3);
		}
	}, [tierTwoLock, tierTwo, tierThree]);

	// 4
	const [tierFour, setTierFour] = useState(config.tierFour ?? 0);
	const [tierFourGoal, setTierFourGoal] = useState(config.tierFourGoal ?? '');
	const incrementTierFour = () => setTierFour(tierFour + 1);
	const hasTierFour = items.length > 3;
	useEffect(() => {
		if (hasTierFour && !tierThreeLock && tierThree && tierThree / 3 >= 1) {
			setTierFour(Math.floor(tierThree / 3) + tierFour);
			setTierThree(tierThree % 3);
		}
	}, [tierThreeLock, hasTierFour, tierThree, tierFour]);

	const incrementTier = [incrementTierOne, incrementTierTwo, incrementTierThree, incrementTierFour];
	const setLockTier = [setTierOneLock, setTierTwoLock, setTierThreeLock];
	const lockedTier = [tierOneLock, tierTwoLock, tierThreeLock];
	const tierValue = [tierOne, tierTwo, tierThree, tierFour];
	const goalValue = [tierOneGoal, tierTwoGoal, tierThreeGoal, tierFourGoal];
	const setGoalValue = [setTierOneGoal, setTierTwoGoal, setTierThreeGoal, setTierFourGoal];

	const handleGoalChange = index => event => {
		const value = event.target.value;
		if (value) {
			if (value.length < 4) { // Up to 999
				setGoalValue[index](Number.parseInt(value, 10));
			}
		} else {
			setGoalValue[index]('');
		}
	};

	const storageState = storage.load();
	const savedHelpers = storageState?.helpers ?? {};

	const newConfig = {
		...config,
		category,
		tierFour,
		tierFourGoal,
		tierOne,
		tierOneGoal,
		tierOneLock,
		tierThree,
		tierThreeGoal,
		tierThreeLock,
		tierTwo,
		tierTwoGoal,
		tierTwoLock,
	};
	const newHelpers = {...savedHelpers, [itemId]: newConfig};
	storage.save({...storageState, helpers: newHelpers});

	return (
		<section>
			{items.map((item, itemIndex) => {
				// eslint-disable-next-line no-warning-comments
				// FIXME find a better way
				// eslint-disable-next-line react-hooks/rules-of-hooks
				const [source, setSource] = useState(`${IMG_URL}${item.images?.filename_icon}.png`);

				let tooManyRetries = 0;
				const tryOtherUrl = () => {
					if (!tooManyRetries) {
						setSource(`${IMG_URL2}${item.images?.filename_icon}.png`);
					}

					tooManyRetries++;
				};

				const isGoalSet = goalValue[itemIndex] > 0;
				const isGoalReached = isGoalSet && tierValue[itemIndex] >= goalValue[itemIndex];

				return (
					<div key={item.name} css={wrapper}>
						<label data-testid='goal-label' css={label} title='Set target goal. Color will change to green when reached'>
							<input
								css={input}
								max='999'
								maxLength='3'
								min='0'
								step='1'
								type='number'
								value={goalValue[itemIndex]}
								onChange={handleGoalChange(itemIndex)}
							/>
							<div css={actions} className='material-symbols-outlined'>pin</div>
						</label>
						<button
							css={button}
							data-goal={isGoalSet ? goalValue[itemIndex] : undefined}
							data-testid={`button-tier-${itemIndex}`}
							style={{backgroundImage: `url(${backgrounds[(item.rarity ?? 1) - 1]})`}}
							title={isGoalSet && !isGoalReached ? `${goalValue[itemIndex] - tierValue[itemIndex]} ${item.name} remaining` : item.name}
							type='button'
							onClick={incrementTier[itemIndex]}
						>
							<img alt={item.name} src={source} width='75' height='75' onError={tryOtherUrl}/>
							<span css={rarity}>
								{/* eslint-disable-next-line unicorn/no-new-array, react/no-array-index-key */}
								{new Array(item.rarity ?? 1).fill('').map((_, index) => <span key={index} className='material-symbols-outlined fill'>star</span>)}
							</span>
							<b css={isGoalReached ? reachedGoal : undefined} data-testid={`value-tier-${itemIndex}`}>
								{tierValue[itemIndex]}
							</b>
						</button>
						{itemIndex < items.length - 1 && (
							<label data-testid={`lock-tier-${itemIndex}`} title='Lock this tier from automatically tallying up to the next'>
								<input
									type='checkbox'
									checked={lockedTier[itemIndex]}
									onChange={() => setLockTier[itemIndex](!lockedTier[itemIndex])}
								/>
								<div css={actions} className={`material-symbols-outlined${lockedTier[itemIndex] ? ' fill' : ''}`}>
									{lockedTier[itemIndex] ? 'lock' : 'lock_open'}
								</div>
							</label>
						)}
					</div>
				);
			})}
			<button
				className='material-symbols-outlined'
				css={[actions, removeButton]}
				title='Remove item'
				type='button'
				onClick={() => onRemove(itemId)}
			>
				close
			</button>
		</section>
	);
}

FarmHelper.propTypes = {
	category: PropTypes.string.isRequired,
	config: PropTypes.shape(helpersType),
	itemId: PropTypes.string.isRequired,
	materials: PropTypes.shape(materialsType).isRequired,
	onRemove: PropTypes.func.isRequired,
};

export default FarmHelper;
