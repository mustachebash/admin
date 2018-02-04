const path = require('path'),
	{ DefinePlugin } = require('webpack'),
	merge = require('webpack-merge'),
	UglifyJSPlugin = require('uglifyjs-webpack-plugin'),
	common = require('./webpack.common');

const config = {
	entry: ['whatwg-fetch', './src/index.js'],
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'app.[chunkhash].js',
		publicPath: '/'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: [/node_modules/],
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: ['react', ['env', {modules: false}]],
							plugins: ['transform-object-rest-spread', 'transform-decorators-legacy']
						}
					}
				]
			}
		]
	},
	plugins: [
		new UglifyJSPlugin(),
		new DefinePlugin({
			'API_HOST': JSON.stringify('https://api.mustachebash.com'),
			'process.env': {
				'NODE_ENV': JSON.stringify('production')
			}
		})
	]
};

module.exports = merge(common, config);
