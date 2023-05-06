const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const path = require('path');
const webpackBaseConfig = require('./webpack.base.config');
const modifyVars = require('./modifyVars');

const port = 3000;
const domain = 'http://youcai.abiz.com/';

//如果需要使用ip访问可以在这里配置自己的ip

module.exports = webpackMerge(webpackBaseConfig, {
    output: {
        filename: '[name].js',
        publicPath: domain
    },
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        port: port,
        compress: true,
        disableHostCheck: true,
        host: '0.0.0.0',
        hot: true,
        historyApiFallback: true,
        publicPath: '/',
        proxy: {
            "/posts/": {
                target: "//jsonplaceholder.typicode.com",
                pathRewrite: {"^/posts/": ""}
            }
        }
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2, //使用import之前还要经过几次loader
                            sourceMap: true,
                            modules: true,
                            localIdentName: '[local]--[hash:base64:5]',
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                            config: {
                                path: path.resolve(__dirname, './postcss.config.js') //使用postcss单独的配置文件
                            }
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            },
            {
                test: /\.(less|css)$/,
                include: /node_modules/,
                use: [
                    {
                        loader: 'style-loader'
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
                use:
                    {
                        loader: 'file-loader',
                        options:
                            {
                                name: '[name].[ext]'
                            }
                    }
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            //所有ajax请求的基础url
            'BASE_URL': JSON.stringify(`${domain}api`),
            'PROD_PATH': JSON.stringify('')
        })
    ]
})
;
