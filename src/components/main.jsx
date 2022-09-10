import {useState} from 'react';

import FarmHelper from './farm-helper.jsx';
import ItemCategories from './item-categories.jsx';

export default function Main() {
	const [helperList, setHelperList] = useState([]);

	const addHelperWithItem = itemName => {
		const category = itemName.split('.')[0];
		const item = itemName.split('.')[1];
		setHelperList(helperList.concat(<FarmHelper key={helperList.length} category={category} item={item}/>));
	};

	const onChange = event => {
		addHelperWithItem(event.target.value);
	};

	return (
		<>
			{helperList}
			<ItemCategories onChangeProp={onChange}/>
		</>
	);
}
