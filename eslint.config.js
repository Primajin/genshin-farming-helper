import vitest from '@vitest/eslint-plugin';
import xo from 'xo';

/** @type {import('xo').FlatXoConfig} */
const eslintConfig = [
	{
		files: ['src/**/__tests__/*'], // Or any other pattern
		plugins: {
			vitest,
		},
		rules: {
			...vitest.configs.recommended.rules, // You can also use vitest.configs.all.rules to enable all rules
			'unicorn/prefer-global-this': 'off',
		},
	},
	{
		files: ['**/*.{js,jsx,ts,tsx}'],
		languageOptions: {ecmaVersion: 'latest'},
		react: true,
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
			'import-x/extensions': 'off',
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

export default xo.xoToEslintConfig(eslintConfig);
