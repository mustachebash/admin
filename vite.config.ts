import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
	plugins: [react()],
	css: {
		modules: {
			localsConvention: 'camelCase',
			generateScopedName: '[name]__[local]___[hash:base64:5]'
		}
	},
	resolve: {
		alias: {
			'@': resolve(__dirname, './src')
		}
	},
	server: {
		host: '0.0.0.0',
		allowedHosts: ['.localhost', 'admin-mustachebash.local.mrstache.io'],
		port: 8080
	},
	build: {
		sourcemap: false,
		rollupOptions: {
			output: {
				manualChunks: {
					vendor: ['react', 'react-dom', 'react-router-dom'],
					charts: ['chart.js', 'react-chartjs-2']
				}
			}
		}
	}
});
