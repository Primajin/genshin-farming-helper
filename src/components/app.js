import {useState} from 'react';

import FarmHelper from './farm-helper.js';
import ItemPicker from './item-picker.js';

export default function App() {
	const [helperList, setHelperList] = useState([<FarmHelper key='initial'/>]);
	const [value, setValue] = useState('Ascension.AgnidusAgate');

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
			<ItemPicker onChangeProp={onChange} onSubmitProp={onSubmit}/>
		</>
	);
}
