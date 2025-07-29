import xo from 'eslint-config-xo';
import xoReact from 'eslint-config-xo-react';
import vitestPlugin from 'eslint-plugin-vitest';

const config = [
	// Base XO configuration
	...xo,

	// XO React configuration
	...xoReact,

	// General rules override
	{
		rules: {
			'capitalized-comments': [
				'error',
				'always',
				{
					ignorePattern: 'v8|pragma|ignore|prettier-ignore',
					ignoreInlineComments: true,
					ignoreConsecutiveComments: true,
				},
			],
			'import-x/order': [
				'error',
				{
					groups: [
						'builtin',
						'external',
						'parent',
						'sibling',
						'index',
					],
				},
			],
			'react/react-in-jsx-scope': 'off',
			'react/require-default-props': [
				2,
				{
					forbidDefaultForRequired: true,
					functions: 'defaultArguments',
				},
			],
			'react/no-unknown-property': [
				2,
				{
					ignore: [
						'css',
					],
				},
			],
		},
	},

	// File extensions override - disable for all JS files
	{
		files: ['**/*.js', '**/*.jsx'],
		rules: {
			'import-x/extensions': 'off',
		},
	},

	// Test files configuration
	{
		files: ['src/**/__tests__/*'],
		plugins: {
			vitest: vitestPlugin,
		},
		rules: {
			...vitestPlugin.configs['legacy-recommended'].rules,
			'unicorn/prefer-global-this': 'off',
			// Allow unused vars in tests (they're often imported for testing)
			'no-unused-vars': 'off',
			// Allow navigator redeclaration in tests (for mocking)
			'no-redeclare': 'off',
		},
	},
];

export default config;
