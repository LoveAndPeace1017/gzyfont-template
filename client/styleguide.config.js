const camelCase = require('lodash/camelCase');
const upperFirst = require('lodash/upperFirst');
const path = require('path');
const { styles, theme } = require('./src/styleguide/styleguide.styles');
const { version } = require('../package.json');
const webpackDevConfig = require('./config/webpack.dev.config');
const webpackMerge = require('webpack-merge');
const modifyVars = require('./config/modifyVars');

module.exports = {
    title: `jxc ${version}`,
    serverPort: 6060,
    styles,
    theme,
    // assetsDir: '',
    // styleguideDir: '',
    webpackConfig:webpackMerge.strategy({ 'module.rules': 'replace'})(webpackDevConfig, {
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    include: [path.resolve(__dirname, 'src')],
                    exclude: [/node_modules/, path.resolve(__dirname, 'src/js')],
                    use: {
                        loader: 'babel-loader', //主要用于编译es6语法和react的jsx语法
                        query: {
                            cacheDirectory: true //开启缓存，提升速度
                        }
                        //options请看.babelrc文件
                    }
                },
                {
                    test: /\.scss$/,
                    include: [path.resolve(__dirname, 'src')],
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'style-loader',
                            options:{
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
                                    path: path.resolve(__dirname, './config/postcss.config.js') //使用postcss单独的配置文件
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
                    include: [path.resolve(__dirname, 'src')],
                    exclude: /node_modules/,
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
        }
    }),
    styleguideComponents: {
        // Logo: path.join(__dirname, 'src/components/layout/header/images/logo.png'),
        Wrapper: path.join(__dirname, 'src/styleguide/Wrapper')
    },
    template: {
        favicon: path.join(__dirname, 'public/favicon.ico')
    },
    // components: 'src/components/**/views/*.jsx',
    getComponentPathLine: (componentPath) => {
        let name = path.basename(componentPath, '.jsx'); //路径中的文件名称
        const dir = path.dirname(componentPath); //文件路径
        // console.log('dir:'+ dir);
        const dirArr = dir.split('\\');
        const newDir = dirArr.slice(1, 4).join('/');  //保留路径的前三个层级
        let componentName = name;
        if(name === 'index'){  //如果文件名称为index，则import的组件名称用文件夹的名称
            componentName = dirArr.slice(3, 4)[0]
        }
        componentName = upperFirst(camelCase(componentName));
        // console.log('name:'+name)
        if(name !== 'index'){ //如果文件名称不为index那么import的时候需要添加花括号
            componentName = '{'+componentName+'}'
        }
        return `import ${componentName} from '${newDir}';`
    },
    sections: [
        {
            name: '前言',
            content: 'src/styleguide/readme.md'
        },
        {
            name: 'Business（业务类组件）',
            components: 'src/components/business/**/views/*.jsx',
            ignore: 'src/components/business/**/views/with\*.jsx',
            // exampleMode: 'expand',
            usageMode: 'expand'
        },
        {
            name: 'Layout（整体布局类组件）',
            components: 'src/components/layout/**/views/*.jsx',
            usageMode: 'expand'
        },
        {
            name: 'Widgets（通用类组件）',
            components: 'src/components/widgets/**/views/*.jsx',
            usageMode: 'expand'
        },
        {
            name: '下拉选择组件',
            components: 'src/pages/**/views/select\*.jsx',
            usageMode: 'expand'
        }
    ]
};