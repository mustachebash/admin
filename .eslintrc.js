module.exports = {
	parser: '@babel/eslint-parser',
	parserOptions: {
		ecmaVersion: 2021,
		sourceType: 'module',
		ecmaFeatures: {
			jsx: true
		},
		requireConfigFile: false,
		babelOptions: {
			presets: ['@babel/preset-react'],
			plugins: [['@babel/proposal-decorators', {legacy: true}], '@babel/proposal-class-properties']
		}
	},
	settings: {
		react: {
			version: 'detect'
		}
	},
	plugins: [
		'react',
		'react-hooks'
	],
	globals: {
		API_HOST: false,
		EVENT_2020_ID: false,
		EVENT_2022_ID: false,
		fetch: false
	},
	extends: [
		'eslint:recommended',
		'plugin:react/recommended'
	],
	env: {
		browser: true,
		node: true,
		es6: true
	},
	rules: {
		'arrow-body-style': 2,
		'arrow-parens': [2, 'as-needed'],
		camelcase: 2,
		'class-methods-use-this': [2, {exceptMethods: ['componentDidCatch']}],
		'dot-notation': 2,
		'comma-dangle': 2,
		'comma-spacing': 2,
		eqeqeq: 2,
		indent: [ 2, 'tab', { SwitchCase: 1 } ],
		'key-spacing': 2,
		'max-len': [ 2, 200, 2 ],
		'lines-between-class-members': [2, 'always', { exceptAfterSingleLine: true }],
		'no-alert': 2,
		'no-console': [2, { allow: ['error'] }],
		'no-dupe-class-members': 0,
		'no-multiple-empty-lines': 2,
		'no-restricted-globals': ['error', 'event', 'fdescribe'],
		'no-shadow': 2,
		'no-unneeded-ternary': [2, { defaultAssignment: false }],
		'no-unused-expressions': 2,
		'no-unused-vars': 2,
		'no-var': 2,
		'object-shorthand': 2,
		'padded-blocks': [ 2, 'never' ],
		'prefer-const': 2,
		'prefer-arrow-callback': 2,
		quotes: [ 2, 'single' ],
		'require-await': 2,
		semi: [ 2, 'always' ],
		'space-before-function-paren': [ 2, { anonymous: 'always', named: 'never' } ],
		'space-infix-ops': 0,
		strict: 0,
		yoda: 2,
		'jsx-quotes': 2,
		'react/jsx-curly-brace-presence': [2, 'never'],
		'react/no-unescaped-entities': 0,
		'react/no-unused-prop-types': 2,
		'react/no-unused-state': 2,
		'react-hooks/rules-of-hooks': 2,
		'react-hooks/exhaustive-deps': 1
	}
};
