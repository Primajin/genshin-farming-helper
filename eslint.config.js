import xo from 'eslint-config-xo';
import xoReact from 'eslint-config-xo-react';
import vitest from '@vitest/eslint-plugin';

const config = [
	// Apply XO base config to all files
	...xo,

	// Apply XO React config to JSX/TSX files only
	{
		files: ['**/*.jsx', '**/*.tsx'],
		...xoReact[0],
	},

	// Our custom rules override for all files
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
			'import-x/extensions': 'off', // Disable file extensions globally
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

	// Test files configuration - this should come after the base configs
	{
		files: ['src/**/__tests__/*'],
		plugins: {
			vitest,
		},
		rules: {
			...vitest.configs.recommended.rules,
			'unicorn/prefer-global-this': 'off',
			// Allow unused vars in tests (they're often imported for testing)
			'no-unused-vars': 'off',
			// Allow navigator redeclaration in tests (for mocking)
			'no-redeclare': 'off',
		},
	},

	// Special files configuration
	{
		files: ['setup-tests.js'],
		rules: {
			// Allow unassigned imports in setup files
			'import-x/no-unassigned-import': 'off',
		},
	},

	// Allow navigator redeclaration in utility files that need to mock it
	{
		files: ['src/utils/wake-lock.js'],
		rules: {
			'no-redeclare': 'off',
		},
	},

	// JSX files configuration - allow JSX components that may appear unused
	{
		files: ['**/*.jsx'],
		rules: {
			// JSX components are often imported but appear unused to the linter
			'no-unused-vars': ['error', {
				vars: 'all',
				args: 'after-used',
				ignoreRestSiblings: true,
				varsIgnorePattern: '^React$|^[A-Z]', // Ignore React and PascalCase (component names)
			}],
		},
	},

	// Final override - ensure import-x/extensions is disabled
	{
		files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
		rules: {
			'import-x/extensions': 'off',
		},
	},
];

export default config;
