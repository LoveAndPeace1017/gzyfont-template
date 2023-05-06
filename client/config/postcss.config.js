module.exports = ({ file, options, env }) => ({
	plugins: [require('autoprefixer'), require('postcss-preset-env')]
});
