const path = require('path'),
	merge = require('webpack-merge'),
	webpack = require('webpack'),
	common = require('./webpack.common');

const config = {
	entry: [
		'react-hot-loader/patch',
		'react-devtools',
		'./src/index.js'
	],
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'app.[hash].js',
		publicPath: '/'
	},
	devtool: 'inline-source-map',
	devServer: {
		contentBase: './dist',
		historyApiFallback: {
			disableDotRule: true
		}
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
							plugins: ['react-hot-loader/babel', 'transform-object-rest-spread', 'transform-decorators-legacy']
						}
					}
				]
			}
		]
	},
	plugins: [
		new webpack.NamedModulesPlugin(),
		new webpack.NoEmitOnErrorsPlugin(),
		new webpack.DefinePlugin({
			'API_HOST': JSON.stringify('http://localhost:5000'),
			'process.env': {
				'NODE_ENV': JSON.stringify('development')
			}
		})
	]
};

module.exports = merge(common, config);
