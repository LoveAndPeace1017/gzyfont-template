const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
	entry: {
        index: ['@babel/polyfill', path.resolve(__dirname, '../', 'src/index.js')]
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader', //主要用于编译es6语法和react的jsx语法
					query: {
						cacheDirectory: true //开启缓存，提升速度
					}
					//options请看.babelrc文件
				}
			}
		]
	},
	plugins: [
        new HtmlWebpackPlugin({
            title: '百卓轻云ERP-移动端',
            filename: 'index.html',
            template: path.resolve(__dirname, '../', 'public/index.html'),
            favicon: path.resolve(__dirname, '../', 'public/favicon.ico')
        })
	],
	resolve: {
        modules: [
            path.resolve(__dirname, '../', 'src'),
            'node_modules'
        ],
		extensions: ['.js', '.jsx'],
		alias: {
            components: path.resolve(__dirname, '../', 'src/components'),
            pages: path.resolve(__dirname, '../', 'src/pages'),
            styles: path.resolve(__dirname, '../', 'src/styles'),
            images: path.resolve(__dirname, '../', 'src/images'),
            utils: path.resolve(__dirname, '../', 'src/utils')
		}
	}
};
