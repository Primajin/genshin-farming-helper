import PropTypes from 'prop-types';
import {useEffect, useState} from 'react';

import materials from '../constants';
import {getOffset} from '../helper';
import backgrounds from './backgrounds.js';

function FarmHelper({category, item}) {
	const items = materials[category][item];
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

	const offset = getOffset(items.length);

	return (
		<section>
			{items.map((itemPath, index) => (
				<div key={itemPath} className='wrapper'>
					<button
						style={{backgroundImage: `url(${backgrounds[index + offset]})`}}
						type='button'
						onClick={incTier[index]}
					>
						<img alt={`${item} Tier ${index + 1}`} src={itemPath} width='75' height='75'/>
						<br/>
						{tierValue[index]}
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
	category: 'Ascension',
	item: 'AgnidusAgate',
};

export default FarmHelper;
