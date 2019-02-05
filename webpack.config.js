const path = require('path'),
	webpack = require('webpack'),
	CleanWebpackPlugin = require('clean-webpack-plugin'),
	UglifyJSPlugin = require('uglifyjs-webpack-plugin'),
	MiniCssExtractPlugin = require('mini-css-extract-plugin'),
	OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin'),
	HtmlWebpackPlugin = require('html-webpack-plugin'),
	ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

module.exports = (env = {}, argv) => {
	const devMode = argv.mode !== 'production',
		debugMode = env.debug,
		entry = ['whatwg-fetch', './src/index.js'];

	if(debugMode) entry.unshift('react-devtools');

	return {
		entry,
		devtool: devMode ? 'inline-source-map' : false,
		resolve: {
			modules: [path.resolve(__dirname, 'src'), 'node_modules']
		},
		output: {
			path: path.resolve(__dirname, 'dist'),
			filename: 'app.[hash].js',
			publicPath: '/'
		},
		devServer: {
			publicPath: '/',
			contentBase: './dist',
			historyApiFallback: {
				disableDotRule: true
			}
		},
		module: {
			rules: [
				{
					test: /(\.less$)|(\.css$)/,
					use: [
						devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
						'css-loader',
						'less-loader'
					]
				},
				{
					test: /\.js$/,
					exclude: [/node_modules/],
					use: [
						{
							loader: 'babel-loader',
							options: {
								presets: ['@babel/react', ['@babel/env', {modules: false}]],
								plugins: [
									'react-hot-loader/babel',
									'@babel/proposal-object-rest-spread',
									['@babel/proposal-decorators', {legacy: true}]
								]
							}
						}
					]
				},
				{
					test: /(\.jpg$)|(\.png$)/,
					use: 'url-loader'
				}
			]
		},
		optimization: {
			minimizer: [
				new OptimizeCssAssetsPlugin({
					cssProcessorOptions: {discardComments: {removeAll: true}}
				}),
				new UglifyJSPlugin()
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
			new MiniCssExtractPlugin({
				filename: '[name].[contenthash].css'
			}),
			new webpack.DefinePlugin({
				API_HOST: JSON.stringify(devMode ? 'http://localhost:5000' : 'https://api.mustachebash.com')
			})
		]
	};
};
