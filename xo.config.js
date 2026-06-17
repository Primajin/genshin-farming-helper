import {fixupConfigRules} from '@eslint/compat';
import vitest from '@vitest/eslint-plugin';
import xoReact from 'eslint-config-xo-react';

/** @type {import('xo').FlatXoConfig} */
const xoConfig = [
	{
		ignores: [
			'index.html',
			'package-lock.json',
		],
	},
	...fixupConfigRules(xoReact()).map(config => ({
		...config,
		files: ['**/*.{jsx,tsx}'],
	})),
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
			'jsdoc/require-asterisk-prefix': 'off',
			'xo/import-specifier-newline': 'off',
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
	{
		files: ['**/*.{test,spec}.{js,jsx,ts,tsx}', '**/__tests__/**/*.{js,jsx,ts,tsx}'],
		rules: {
			'unicorn/no-global-object-property-assignment': 'off',
			'unicorn/filename-case': 'off',
		},
	},
	{
		files: ['eslint.config.js', 'xo.config.js'],
		rules: {
			'import-x/no-extraneous-dependencies': 'off',
			'n/no-extraneous-import': 'off',
		},
	},
	{
		files: ['src/scripts/**/*.{js,jsx,ts,tsx}'],
		rules: {
			'unicorn/no-top-level-side-effects': 'off',
		},
	},
	{
		settings: {
			react: {version: '19'},
		},
	},
];

export default xoConfig;
