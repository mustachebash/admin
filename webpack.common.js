const path = require('path'),
	CleanWebpackPlugin = require('clean-webpack-plugin'),
	HtmlWebpackPlugin = require('html-webpack-plugin'),
	ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin'),
	ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractLess = new ExtractTextPlugin({
	filename: 'admin.[contenthash].css',
	disable: process.env.NODE_ENV !== 'production'
});

const config = {
	resolve: {
		modules: [path.resolve(__dirname, 'src'), 'node_modules']
	},
	module: {
		rules: [
			{
				test: /(\.less$)|(\.css$)/,
				use: extractLess.extract({
					use: ['css-loader', 'postcss-loader', 'less-loader'],
					fallback: 'style-loader'
				})
			},
			{
				test: /(\.jpg$)|(\.png$)/,
				use: 'url-loader'
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin(['dist']),
		new HtmlWebpackPlugin({
			inject: 'head',
			template: 'src/index.html'
		}),
		new ScriptExtHtmlWebpackPlugin({
			defaultAttribute: 'defer'
		}),
		extractLess
	]
};

module.exports = config;
