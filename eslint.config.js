import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettier from 'eslint-plugin-prettier/recommended';

import { defineConfig } from 'eslint/config';

export default defineConfig([
	js.configs.recommended,
	tseslint.configs.recommended,
	react.configs.flat['jsx-runtime'],
	{
		files: ['**/*.{ts,tsx}'],
		plugins: {
			react,
			'react-hooks': reactHooks,
			'react-refresh': reactRefresh
		},
		languageOptions: {
			parserOptions: {
				ecmaFeatures: {
					jsx: true
				}
			},
			globals: {
				fetch: 'readonly',
				console: 'readonly',
				document: 'readonly',
				window: 'readonly',
				navigator: 'readonly',
				location: 'readonly'
			}
		},
		settings: {
			react: {
				version: 'detect'
			}
		},
		rules: {
			...reactHooks.configs.recommended.rules,
			'react-refresh/only-export-components': 'warn',
			'no-console': ['error', { allow: ['error'] }],
			'prefer-const': 'error',
			'no-var': 'error',
			'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
			'@typescript-eslint/no-explicit-any': 'warn'
		}
	},
	prettier
]);
