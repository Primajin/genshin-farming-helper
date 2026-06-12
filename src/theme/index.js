import {css} from '@emotion/react';

const primary = '#eae6dd';
const secondary = '#ddd8cf';
const text = '#4a5566';
const accent = '#ffcc00';
const success = '#4CAF50';
const successDark = '#347d39';
const fab = {start: '#667eea', end: '#764ba2'};
const goalBadge = {background: '#c2fd5e', text: '#343432'};
const star = '#fdc950';

const theme = {
	accent,
	fab,
	goalBadge,
	primary,
	secondary,
	star,
	success,
	successDark,
	text,
	actions: css`
		background: ${primary};
		border-radius: 50%;
		border: 0;
		margin-top: 3px;
		padding: 3px;
	`,
	searchInput: css`
		clip: auto;
		clip-path: none;
		height: auto;
		overflow: visible;
		position: static;
		white-space: normal;
		width: 100%;
		background: ${primary};
		border: 1px solid rgba(0,0,0,0.3);
		border-radius: 5px;
		color: ${text};
		font-size: 14px;
		padding: 8px 12px;
		box-sizing: border-box;
	`,
};

export default theme;
