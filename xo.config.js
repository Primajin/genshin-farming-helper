import vitest from '@vitest/eslint-plugin';
import xoReact from 'eslint-config-xo-react';

/**
@type {import('xo').FlatXoConfig}
*/
const xoConfig = [
	{
		ignores: [
			'index.html',
			'package-lock.json',
		],
	},
	...xoReact(),
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
			// `@eslint-react/dom-no-unknown-property` replaces the old `react/no-unknown-property`
			// (eslint-config-xo-react@0.32.0 dropped eslint-plugin-react entirely). Its default
			// options (`requireDataLowercase: true`) are restated here because passing an `options`
			// array replaces them wholesale rather than merging with eslint-config-xo-react's own.
			'@eslint-react/dom-no-unknown-property': [
				'error',
				{
					requireDataLowercase: true,
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
		files: ['src/components/organisms/item-categories.jsx'],
		rules: {
			// The `<label/>` elements here are intentional flex-wrap spacers with no
			// text or control to associate (see the `label:empty` CSS rule in this
			// file) — not real, unlabelled form controls.
			'jsx-a11y-x/label-has-associated-control': 'off',
		},
	},
	{
		files: ['src/components/molecules/tab-panel.jsx'],
		rules: {
			// `<ul role="tablist">`/`<li role="presentation">` is the documented
			// WAI-ARIA APG Tabs pattern (https://www.w3.org/WAI/ARIA/apg/patterns/tabs/):
			// the list itself is intentionally non-interactive, the composite
			// `tablist`/`tab` roles live on its children.
			'jsx-a11y-x/no-noninteractive-element-to-interactive-role': 'off',
		},
	},
];

export default xoConfig;
