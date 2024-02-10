/** @jsxImportSource @emotion/react */
import PropTypes from 'prop-types';
import {css} from '@emotion/react';
import {useEffect, useState} from 'react';

import storage from '../utils/local-storage.js';
import theme from '../theme';
import {
	backgrounds, IMG_URL, IMG_URL2, materialTypes,
} from '../constants';
import {up} from '../utils/theming.js';
import {materialsType} from '../types';

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
		top: 75px;
		transform: translateY(-100%);
		width: 20px;
	}

	> * {
		pointer-events: none;
	}

	> img {
		display: inline-block;
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
	config,
	item,
	materials: {
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
	let items = [];
	let queryItem;
	let dropsIndex = 0;
	switch (category) {
		case materialTypes.ASCENSION: {
			items = characterAscensionMaterials.filter(material => material.name.startsWith(item.split(' ')[0]));
			break;
		}

		case materialTypes.ENHANCEMENT: {
			const reversedCharacterWeaponEnhancementMaterials = characterWeaponEnhancementMaterials.slice();
			queryItem = characterWeaponEnhancementMaterials.find(material => material.name === item);
			dropsIndex = reversedCharacterWeaponEnhancementMaterials.findIndex(material => material.name === item);

			items = queryItem.sources.includes('Crafted') && dropsIndex > 0
				? [
					reversedCharacterWeaponEnhancementMaterials[dropsIndex - 2],
					reversedCharacterWeaponEnhancementMaterials[dropsIndex - 1],
					reversedCharacterWeaponEnhancementMaterials[dropsIndex],
				]
				: [queryItem];
			break;
		}

		case materialTypes.FISH: {
			items = [fish.find(material => material.name === item)];
			break;
		}

		case materialTypes.LEVEL: {
			items = [characterLVLMaterials.find(material => material.name === item)];
			break;
		}

		case materialTypes.LOCAL: {
			items = [localSpecialties.find(material => material.name === item)];
			break;
		}

		case materialTypes.TALENT: {
			queryItem = talentMaterials.find(material => material.name === item);
			items = talentMaterials.filter(material => material.sortRank === queryItem.sortRank);
			break;
		}

		case materialTypes.WEAPON: {
			queryItem = weaponMaterials.find(material => material.name === item);
			items = weaponMaterials.filter(material => material.sortRank === queryItem.sortRank);
			break;
		}

		case materialTypes.WOOD: {
			items = [wood.find(material => material.name === item)];
			break;
		}

		default: {
			console.warn('encountered unexpected item of type', category, item);
		}
	}

	const hasJustOne = items.length === 1;
	const hasTierFour = items.length > 3;

	const [tierOne, setTierOne] = useState(config[0]);
	const [lockTierOne, setLockTierOne] = useState(config[1] || hasJustOne);
	const [tierTwo, setTierTwo] = useState(config[2]);
	const [lockTierTwo, setLockTierTwo] = useState(config[3]);
	const [tierThree, setTierThree] = useState(config[4]);
	const [lockTierThree, setLockTierThree] = useState(config[5]);
	const [tierFour, setTierFour] = useState(config[6]);

	const [tierOneGoal, setTierOneGoal] = useState(config[7] ?? '');
	const [tierTwoGoal, setTierTwoGoal] = useState(config[8] ?? '');
	const [tierThreeGoal, setTierThreeGoal] = useState(config[9] ?? '');
	const [tierFourGoal, setTierFourGoal] = useState(config[10] ?? '');

	const incrementTierOne = () => {
		setTierOne(tierOne + 1);
	};

	const incrementTierTwo = () => {
		setTierTwo(tierTwo + 1);
	};

	const incrementTierThree = () => {
		setTierThree(tierThree + 1);
	};

	const incrementTierFour = () => {
		setTierFour(tierFour + 1);
	};

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

	const incrementTier = [incrementTierOne, incrementTierTwo, incrementTierThree, incrementTierFour];
	const setLockTier = [setLockTierOne, setLockTierTwo, setLockTierThree];
	const lockedTier = [lockTierOne, lockTierTwo, lockTierThree];
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

	const savedHelpers = storage.load();
	const newHelpers = {
		...savedHelpers,
		[`${category}.${item}`]: [
			tierOne,
			lockTierOne,
			tierTwo,
			lockTierTwo,
			tierThree,
			lockTierThree,
			tierFour,
			tierOneGoal,
			tierTwoGoal,
			tierThreeGoal,
			tierFourGoal,
		],
	};
	storage.save(newHelpers);

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
							data-testid={`button-tier-${itemIndex}`}
							style={{backgroundImage: `url(${backgrounds[(item.rarity ?? 1) - 1]})`}}
							title={
								goalValue[itemIndex] > 0 && tierValue[itemIndex] <= goalValue[itemIndex]
									? `${goalValue[itemIndex] - tierValue[itemIndex]} ${item.name} remaining`
									: item.name
							}
							type='button'
							onClick={incrementTier[itemIndex]}
						>
							<img alt={item.name} src={source} width='75' height='75' onError={tryOtherUrl}/>
							<b
								css={goalValue[itemIndex] > 0 && tierValue[itemIndex] >= goalValue[itemIndex] ? reachedGoal : undefined}
								data-testid={`value-tier-${itemIndex}`}
							>
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
				onClick={() => onRemove(item)}
			>
				close
			</button>
		</section>
	);
}

FarmHelper.propTypes = {
	category: PropTypes.string.isRequired,
	config: PropTypes.arrayOf(PropTypes.oneOfType([
		PropTypes.bool,
		PropTypes.number,
		PropTypes.string,
	])).isRequired,
	item: PropTypes.string.isRequired,
	materials: PropTypes.shape(materialsType).isRequired,
	onRemove: PropTypes.func.isRequired,
};

export default FarmHelper;
