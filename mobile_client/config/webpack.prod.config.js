const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');
const webpackBaseConfig = require('./webpack.base.config');
const modifyVars = require('./modifyVars');
const domain = '//erp.abiz.com/';

module.exports = webpackMerge(webpackBaseConfig, {
	output: {
		filename: 'js/[name].[chunkhash:8].js',
		chunkFilename: 'js/[name].[chunkhash:8].js',
		path: path.resolve(__dirname, '../../', 'dist/mobile/'),
		publicPath: domain+ 'mobile/'
	},
	module: {
		rules: [
			{
				test: /\.scss$/,
				exclude: /node_modules/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							publicPath: '../' //css中引入背景图片会在图片url前面加上该路径
						}
					},
					{
						loader: 'css-loader',
						options: {
							importLoaders: 2, //使用import之前还要经过几次loader
							modules: true,
							localIdentName: '[local]--[hash:base64:5]',
						}
					},
					{
						loader: 'postcss-loader',
						options: {
							config: {
								path: path.resolve(__dirname, './postcss.config.js') //使用postcss单独的配置文件
							}
						}
					},
					{
						loader: 'sass-loader'
					}
				]
			},
			{
                test: /\.(less|css)$/,
				include: /node_modules/,
				use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../' //css中引入背景图片会在图片url前面加上该路径
                        }
                    },
					{
						loader: 'css-loader'
					},
					{
						loader: 'less-loader', // compiles Less to CSS,
						options: {
							modifyVars,
							javascriptEnabled: true,
						},
					}
				]
			},
			{
				test: /\.(jpe?g|png|gif|svg)$/,
				use: {
					loader: 'url-loader',
					options: {
						limit: 8192,
						outputPath: 'images/',
						name: '[name].[hash:8].[ext]'
					}
				}
			}
		]
	},
	plugins: [
		// //清除dist目录文件
		new CleanWebpackPlugin(['dist/mobile'], {
			root: path.resolve(__dirname, '../../') //根目录
		}),
		//提取css为单独css文件
		new MiniCssExtractPlugin({
			filename: 'css/[name].[contenthash:8].css',
			chunkFilename: 'css/[name].[contenthash:8].css'
		})
	],
	optimization: {
		// runtimeChunk: true,
		splitChunks: {
			chunks: 'all',
			// minSize: 30000,
			// maxSize: 0,
			// minChunks: 1,
			// maxAsyncRequests: 5,
			// maxInitialRequests: 3,
			// automaticNameDelimiter: '~',
			// name: true,
			cacheGroups: {
				vendors: {
					name: "vendors",
					test: /[\\/]node_modules[\\/]/,
					chunks: "initial", // 只打包初始时依赖的第三方
					priority: 10
				},
				antd: {
					name: 'antd',
					test: /[\\/]node_modules[\\/]antd|antd-mobile[\\/]/,
					priority: 20
				},
				commons: {
					name: "commons",
					test: path.resolve(__dirname, '../src'), // 可自定义拓展你的规则
					minChunks: 2, // 最小共用次数
					priority: 5,
					reuseExistingChunk: true
				}
			}
		},
		minimizer: [
			new UglifyJsPlugin({}),
			new OptimizeCSSAssetsPlugin({}),
			new webpack.DefinePlugin({
				//所有ajax请求的基础url
				'BASE_URL': JSON.stringify(`${domain}api`),
				'PROD_PATH': JSON.stringify('/mobile')
			})
		],
	}
});
