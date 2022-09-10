import {useState} from 'react';

import {materialTypes} from '../constants';
import FarmHelper from './farm-helper.jsx';
import ItemCategories from './item-categories.jsx';

export default function Main() {
	const [helperList, setHelperList] = useState([]);
	const [value, setValue] = useState(materialTypes.ASCENSION + 'Agnidus Agate');

	const addHelperWithItem = itemName => {
		const category = itemName.split('.')[0];
		const item = itemName.split('.')[1];
		setHelperList(helperList.concat(<FarmHelper key={helperList.length} category={category} item={item}/>));
	};

	const onChange = event => setValue(event.target.value);

	const onSubmit = event => {
		event.preventDefault();
		addHelperWithItem(value);
	};

	return (
		<>
			{helperList}
			<ItemCategories onChangeProp={onChange} onSubmitProp={onSubmit}/>
		</>
	);
}
