/** @jsxImportSource @emotion/react */
import PropTypes from 'prop-types';
import {css} from '@emotion/react';
import {useEffect, useState} from 'react';

import {backgrounds, IMG_URL, materialTypes} from '../constants';
import theme from '../theme';
import storage from '../utils/local-storage.js';
import {cleanName} from '../utils/string-manipulation.js';

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

function FarmHelper({category, config, item, materials: {characterAscensionMaterials, characterLVLMaterials, characterWeaponEnhancementMaterials, localSpecialties, talentMaterials, weaponMaterials}, onRemove}) {
	let items = [];
	let queryItem;
	let dropsIndex = 0;
	switch (category) {
		case materialTypes.ASCENSION: {
			items = characterAscensionMaterials.filter(material => material.name.startsWith(item.split(' ')[0])).reverse();
			break;
		}

		case materialTypes.ENHANCEMENT: {
			const reversedCharacterWeaponEnhancementMaterials = characterWeaponEnhancementMaterials.slice().reverse();
			queryItem = characterWeaponEnhancementMaterials.find(material => material.name === item);
			dropsIndex = reversedCharacterWeaponEnhancementMaterials.findIndex(material => material.name === item);

			items = queryItem.source.includes('Crafted') && dropsIndex > 0 ? [reversedCharacterWeaponEnhancementMaterials[dropsIndex - 2], reversedCharacterWeaponEnhancementMaterials[dropsIndex - 1], reversedCharacterWeaponEnhancementMaterials[dropsIndex]] : [queryItem];
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
			items = talentMaterials.filter(material => material.dropdomain === queryItem.dropdomain && material.daysofweek[0] === queryItem.daysofweek[0]).reverse();
			break;
		}

		case materialTypes.WEAPON: {
			queryItem = weaponMaterials.find(material => material.name === item);
			items = weaponMaterials.filter(material => material.dropdomain === queryItem.dropdomain && material.daysofweek[0] === queryItem.daysofweek[0]).reverse();
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

	const incTier = [incTierOne, incTierTwo, incTierThree, incTierFour];
	const setLockTier = [setLockTierOne, setLockTierTwo, setLockTierThree];
	const lockedTier = [lockTierOne, lockTierTwo, lockTierThree];
	const tierValue = [tierOne, tierTwo, tierThree, tierFour];
	const savedHelpers = storage.load();
	const newHelpers = {...savedHelpers, [`${category}.${item}`]: [tierOne, lockTierOne, tierTwo, lockTierTwo, tierThree, lockTierThree, tierFour]};
	storage.save(newHelpers);

	return (
		<section>
			{items.map((item, itemIndex) => {
				// eslint-disable-next-line no-warning-comments
				// FIXME find a better way
				// eslint-disable-next-line react-hooks/rules-of-hooks
				const [src, setSrc] = useState(`${IMG_URL}${item.images?.nameicon}.png`);

				let tooManyRetries = 0;
				const tryOtherUrl = () => {
					if (!tooManyRetries) {
						setSrc(`https://i2.wp.com/gi-builds.sfo3.digitaloceanspaces.com/materials/${cleanName(item.name)}.png`);
					}

					tooManyRetries++;
				};

				return (
					<div key={item.name} css={wrapper}>
						<button css={button} style={{backgroundImage: `url(${backgrounds[(item.rarity ?? 1) - 1]})`}} title={item.name} type='button' onClick={incTier[itemIndex]}>
							<img alt={item.name} src={src} width='75' height='75' onError={tryOtherUrl}/>
							<b>{tierValue[itemIndex]}</b>
						</button>
						{itemIndex < items.length - 1 && (
							<label>
								<input type='checkbox' checked={lockedTier[itemIndex]} onChange={() => setLockTier[itemIndex](!lockedTier[itemIndex])}/>
								<div css={actions} className='material-icons'>
									{lockedTier[itemIndex] ? 'lock' : 'lock_open'}
								</div>
							</label>
						)}
					</div>
				);
			})}
			<div css={[actions, removeButton]} className='material-icons' onClick={() => onRemove(item)}>delete</div>
		</section>
	);
}

FarmHelper.propTypes = {
	category: PropTypes.string,
	config: PropTypes.arrayOf(PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.bool,
	])),
	item: PropTypes.string,
	materials: PropTypes.shape({
		characterAscensionMaterials: PropTypes.arrayOf(PropTypes.object),
		characterLVLMaterials: PropTypes.arrayOf(PropTypes.object),
		characterWeaponEnhancementMaterials: PropTypes.arrayOf(PropTypes.object),
		localSpecialties: PropTypes.arrayOf(PropTypes.object),
		talentMaterials: PropTypes.arrayOf(PropTypes.object),
		weaponMaterials: PropTypes.arrayOf(PropTypes.object),
	}),
	onRemove: PropTypes.func,
};

FarmHelper.defaultProps = {
	category: materialTypes.ASCENSION,
	item: 'Agnidus Agate',
	onRemove() {},
};

export default FarmHelper;
