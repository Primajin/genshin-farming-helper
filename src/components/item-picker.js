import PropTypes from 'prop-types';

import materials from '../constants';
import {getReverseOffset} from '../helper';
import backgrounds from './backgrounds.js';

function ItemPicker({onChangeProp, onSubmitProp}) {
	return (
		<form
			className='choose-item'
			onChange={onChangeProp}
			onSubmit={onSubmitProp}
		>
			{Object.keys(materials).map((categoryName, catIndex) => (
				<fieldset key={categoryName}>
					<legend>{categoryName}:</legend>
					{Object.keys(materials[categoryName]).map((itemName, itemIndex) => (
						<label key={itemName} style={{backgroundImage: `url(${backgrounds[getReverseOffset(materials[categoryName][itemName].length) - 1]})`}}>
							<input defaultChecked={catIndex === 0 && itemIndex === 0} type='radio' name='item' value={`${categoryName}.${itemName}`}/>
							<div><img src={materials[categoryName][itemName].at(-1)} alt={itemName} width='75' height='75'/></div>
						</label>
					))}
				</fieldset>
			))}
			<button type='submit' className='material-icons plus-button'>note_add</button>
		</form>
	);
}

ItemPicker.propTypes = {
	onChangeProp: PropTypes.func.isRequired,
	onSubmitProp: PropTypes.func.isRequired,
};

export default ItemPicker;
