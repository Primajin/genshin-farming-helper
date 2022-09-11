/** @jsxImportSource @emotion/react */
import {useState} from 'react';
import {Global, css} from '@emotion/react';

import {up} from '../utils/theming.js';
import FarmHelper from './farm-helper.jsx';
import ItemCategories from './item-categories.jsx';

const globalStyles = css`
	body {
    background-size: contain;
    background: transparent top center url("https://genshin.hoyoverse.com/_nuxt/img/47f71d4.jpg") no-repeat fixed;
		margin: 0;
		padding: 0;
    font-family: sans-serif;
    text-align: center;
    user-select: none;
	}

  .material-icons {
    cursor: pointer;
  }

  input {
    display: none;
  }

  main {
		position: absolute;
		top: 0;
		z-index: 1;
    left: 50%;
    margin: 0 auto;
		width: 100%;
    max-width: 400px;
    transform: translateX(-50%);
		padding: 15px 0;
  }
`;

const video = css`
	left: 50%;
	min-width: 100vw;
	position: fixed;
	top: 0;
	transform: translateX(-50%);
	z-index: 0;

  ${up(2276)} {
    video {
      width: 100%;
    }
  };
`;

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
			<Global styles={globalStyles}/>
			<div css={video}>
				<video autoPlay='autoplay' poster='https://genshin.hoyoverse.com/_nuxt/img/47f71d4.jpg' loop='loop' muted='muted'>
					<source src='https://genshin.hoyoverse.com/_nuxt/videos/3e78e80.mp4' type='audio/mp4'/>
				</video>
			</div>
			<main>
				{helperList}
				<ItemCategories onChangeProp={onChange}/>
			</main>
		</>
	);
}
