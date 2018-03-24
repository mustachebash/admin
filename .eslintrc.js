module.exports = {
	parser: 'babel-eslint',
	parserOptions: {
		ecmaVersion: 8,
		sourceType: 'module',
		ecmaFeatures: {
			impliedStrict: true,
			jsx: true,
			experimentalObjectRestSpread: true
		}
	},
	plugins: [
		'react'
	],
	globals: {
		API_HOST: false,
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
		'comma-dangle': 2,
		'comma-spacing': 2,
		eqeqeq: 2,
		indent: [ 2, 'tab', { SwitchCase: 1 } ],
		'key-spacing': 2,
		'max-len': [ 2, 200, 2 ],
		'no-alert': 2,
		'no-console': 0,
		'no-multiple-empty-lines': 2,
		'no-var': 2,
		'padded-blocks': [ 2, 'never' ],
		'prefer-const': 2,
		'prefer-arrow-callback': 2,
		'require-await': 2,
		semi: [ 2, 'always' ],
		'space-before-function-paren': [ 2, { anonymous: 'always', named: 'never' } ],
		'space-infix-ops': 0,
		yoda: 2,
		strict: 0,
		'no-unused-vars': [ 2, { args: 'none' } ],
		quotes: [ 2, 'single' ],
		'react/prop-types': 0,
		'react/no-unescaped-entities': 0
	}
};
