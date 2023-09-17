import {css} from '@emotion/react';

const primary = '#eae6dd';

const theme = {
	primary,
	actions: css`
		background: ${primary};
		border-radius: 50%;
		border: 0;
		height: 30px;
		margin-top: 3px;
		padding: 3px;
		width: 30px;
	`,
};

export default theme;
