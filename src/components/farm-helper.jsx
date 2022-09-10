import PropTypes from 'prop-types';
import genshinDB from 'genshin-db';
import {useEffect, useState} from 'react';

import {backgrounds, materialTypes, nameKeys} from '../constants';

function FarmHelper({category, item}) {
	let items = [];
	let itemNames;
	switch (category) {
		case materialTypes.TALENT:
			itemNames = nameKeys.map(key => genshinDB.talentmaterialtypes(item)[key]);
			items = itemNames.filter(Boolean).map(name => genshinDB.materials(name));
			break;
		case materialTypes.WEAPON:
			itemNames = nameKeys.map(key => genshinDB.weaponmaterialtypes(item)[key]);
			items = itemNames.filter(Boolean).map(name => genshinDB.materials(name));
			break;
		case materialTypes.LEVEL:
			// NOT YET IMPLEMENTED
			items = [genshinDB.materials(item)];
			break;
		default:
			itemNames = item.split(' ')[0];
			items = genshinDB
				.materials('names', {matchCategories: true, verboseCategories: true})
				.filter(item => item.name.includes(itemNames))
				.sort((a, b) => a.sortorder - b.sortorder).reverse();
			break;
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
			{items.map((item, index) => (
				<div key={item.name} className='wrapper'>
					<button
						style={{backgroundImage: `url(${backgrounds[item.rarity - 1]})`}}
						title={item.name}
						type='button'
						onClick={incTier[index]}
					>
						<img alt={item.name} src={item?.images.fandom} width='75' height='75'/>
						<b>{tierValue[index]}</b>
					</button>
					{index < items.length - 1 && (
						<label>
							<input
								type='checkbox'
								checked={lockedTier[index]}
								onChange={() => setLockTier[index](!lockedTier[index])}
							/>
							<span className='material-icons'>
								{lockedTier[index] ? 'lock' : 'lock_open'}
							</span>
						</label>
					)}
				</div>
			))}
		</section>
	);
}

FarmHelper.propTypes = {
	category: PropTypes.string,
	item: PropTypes.string,
};

FarmHelper.defaultProps = {
	category: materialTypes.ASCENSION,
	item: 'Agnidus Agate',
};

export default FarmHelper;
