import vitest from '@vitest/eslint-plugin';
import xo from 'xo';
import xoReactConfig from 'eslint-config-xo-react';
import {globalIgnores} from 'eslint/config';

/** @type {import('xo').FlatXoConfig} */
const eslintConfig = [
	globalIgnores([
		'package-lock.json',
	]),
	...xoReactConfig,
	{
		files: ['src/**/__tests__/*'],
		plugins: {
			vitest,
		},
		rules: {
			...vitest.configs.recommended.rules,
			'unicorn/prefer-global-this': 'off',
		},
	},
	{
		files: ['**/*.{js,jsx,ts,tsx}'],
		rules: {
			'import-x/extensions': 'off',
			'import-x/order': [
				'error',
				{
					'newlines-between': 'always',
					groups: [
						['builtin', 'external'],
						['parent', 'sibling'],
						'index',
					],
				},
			],
			'react/react-in-jsx-scope': 'off',
			'react/require-default-props': [
				'error',
				{
					forbidDefaultForRequired: true,
					functions: 'defaultArguments',
				},
			],
			'react/no-unknown-property': [
				'error',
				{
					ignore: [
						'css',
					],
				},
			],
		},
	},
];

// Ensure that the config is compatible with ESLint (this will import the necessary plugins and parsers under the hood)
export default xo.xoToEslintConfig(eslintConfig);
