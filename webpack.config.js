const path = require('path')

module.exports = {
	entry: [ 'babel-polyfill', './src/js/index.js' ],
	output: {
		path: path.join(__dirname, 'build'),
		filename: 'bundle.js',
	},
	module: {
		rules: [
		{
			loader: 'babel-loader',
			test: /\.js$/,
			exclude: /node_modules/,
			query: {
				presets: [ 'env' ]
                        }
		}
		],
	},
	devtool: 'source-map',
	devServer: {
		contentBase: path.join(__dirname, '/public/'),
	},
}
