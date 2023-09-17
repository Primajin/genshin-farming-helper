import {css} from '@emotion/react';

const primary = '#eae6dd';

const theme = {
	primary,
	actions: css`
		background: ${primary};
		border-radius: 50%;
		border: 0;
		margin-top: 3px;
		padding: 3px;
	`,
};

export default theme;
