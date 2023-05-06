const webpackDevConfig = require('./config/webpack.dev.config');
const webpackProdConfig = require('./config/webpack.prod.config');

let webpackConfig = {};

module.exports = (env, argv) => {
	switch (argv.mode) {
		case 'development':
			webpackConfig = webpackDevConfig;
			break;
		case 'production':
			webpackConfig = webpackProdConfig;
			break;
		default:
			break;
	}
	return webpackConfig;
};
