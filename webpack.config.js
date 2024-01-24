const path = require('path'),
	webpack = require('webpack'),
	{ CleanWebpackPlugin } = require('clean-webpack-plugin'),
	TerserPlugin = require('terser-webpack-plugin'),
	MiniCssExtractPlugin = require('mini-css-extract-plugin'),
	CssMinimizerPlugin = require('css-minimizer-webpack-plugin'),
	HtmlWebpackPlugin = require('html-webpack-plugin'),
	{ StatsWriterPlugin } = require('webpack-stats-plugin');

module.exports = (env = {}, argv) => {
	const devMode = argv.mode !== 'production',
		debugMode = env.debug,
		entry = ['./src/index.js'];

	if(debugMode) entry.unshift('react-devtools');

	return {
		entry: {
			app: entry
		},
		devtool: devMode ? 'inline-source-map' : false,
		resolve: {
			modules: [path.resolve(__dirname, 'src'), 'node_modules'],
			alias: {
				'react-dom': '@hot-loader/react-dom'
			}
		},
		output: {
			path: path.resolve(__dirname, 'dist'),
			filename: '[name].[contenthash].js',
			chunkFilename: '[name].chunk.[chunkhash].js',
			assetModuleFilename: 'img/[name].[hash][ext][query]',
			publicPath: '/'
		},
		devServer: {
			port: 8082,
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
								presets: ['@babel/react', ['@babel/env', {modules: false, useBuiltIns: 'usage', corejs: 3}]],
								plugins: [
									'react-hot-loader/babel',
									['@babel/proposal-decorators', {legacy: true}],
									'@babel/proposal-class-properties'
								]
							}
						}
					]
				},
				{
					test: /(\.jpg$)|(\.png$)/,
					include: [/img/],
					type: 'asset/resource'
				},
				{
					test: /\.html$/,
					use: [{
						loader: 'html-loader',
						options: {
							minimize: false
						}
					}]
				}
			]
		},
		optimization: {
			splitChunks: {
				chunks: 'all',
				cacheGroups: {
					defaultVendors: {
						test: /[\\/]node_modules[\\/]/,
						name: 'vendors',
						chunks: 'all'
					}
				}
			},
			minimizer: [
				new CssMinimizerPlugin({
					minimizerOptions: { preset: ['default', { discardComments: { removeAll: true } }] }
				}),
				new TerserPlugin()
			]
		},
		plugins: [
			new CleanWebpackPlugin(),
			new HtmlWebpackPlugin({
				inject: 'head',
				filename: 'index.html',
				template: 'src/index.html',
				minify: {
					collapseWhitespace: true,
					keepClosingSlash: true,
					removeComments: true,
					removeRedundantAttributes: false,
					removeScriptTypeAttributes: true,
					removeStyleLinkTypeAttributes: true,
					useShortDoctype: true
				}
			}),
			new MiniCssExtractPlugin({
				filename: '[name].[contenthash].css'
			}),
			new StatsWriterPlugin({
				filename: '../stats.json',
				stats: {
					all: false,
					assets: true
				}
			}),
			new webpack.DefinePlugin({
				API_HOST: JSON.stringify(devMode ? 'https://localhost:5000' : 'https://api.mustachebash.com'),
				TICKET_LINK_HOST: JSON.stringify(devMode ? 'https://localhost:8081' : 'https://mustachebash.com'),
				BRAINTREE_HOST: JSON.stringify(devMode ? 'https://sandbox.braintreegateway.com' : 'https://www.braintreegateway.com'),
				BRAINTREE_MERCHANT_ID: JSON.stringify(devMode ? 'ht835xhgsgwsz2hn' : 't7bcxj3vjz92bxr2'),
				// These need special pairing in admin
				EVENT_2020_ID: JSON.stringify('34a99b2a-f826-406a-8227-921efd03ebff'),
				EVENT_2022_ID: JSON.stringify('a0ae862c-1755-497c-b843-8457b5696a2a')
			})
		]
	};
};
