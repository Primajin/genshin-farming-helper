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
	{
		files: ['**/*.{js,jsx,ts,tsx}'],
		rules: {
			'@eslint-community/eslint-comments/require-description': 'off',
			'jsdoc/check-types': 'off',
			'jsdoc/informative-docs': 'off',
			'jsdoc/reject-any-type': 'off',
			'jsdoc/require-asterisk-prefix': 'off',
			'jsdoc/require-param': 'off',
			'jsdoc/require-param-description': 'off',
			'jsdoc/require-param-type': 'off',
			'jsdoc/require-returns-description': 'off',
			'jsdoc/valid-types': 'off',
			'no-shadow': 'off',
			'regexp/no-super-linear-move': 'off',
			'regexp/no-useless-flag': 'off',
			'regexp/optimal-quantifier-concatenation': 'off',
			'regexp/prefer-named-capture-group': 'off',
			'unicorn/filename-case': 'off',
			'unicorn/no-break-in-nested-loop': 'off',
			'unicorn/no-computed-property-existence-check': 'off',
			'unicorn/no-duplicate-loops': 'off',
			'unicorn/no-incorrect-query-selector': 'off',
			'unicorn/no-negated-array-predicate': 'off',
			'unicorn/no-useless-template-literals': 'off',
			'unicorn/prefer-early-return': 'off',
			'unicorn/prefer-includes-over-repeated-comparisons': 'off',
			'unicorn/prefer-number-coercion': 'off',
			'unicorn/prefer-object-iterable-methods': 'off',
			'unicorn/prefer-split-limit': 'off',
			'xo/import-specifier-newline': 'off',
		},
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
		files: ['**/*.{jsx,tsx}'],
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
	{
		files: ['**/*.{test,spec}.{js,jsx,ts,tsx}', '**/__tests__/**/*.{js,jsx,ts,tsx}'],
		rules: {
			'unicorn/no-global-object-property-assignment': 'off',
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
