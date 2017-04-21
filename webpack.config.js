var path = require('path');

module.exports = {
	entry: ["babel-polyfill", "./src/index.js"],
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: "babel-loader"
			},
		]
	},
	devServer: {
		contentBase: path.join(__dirname, "dist"),
		compress: true,
		clientLogLevel: "none",
		noInfo: true,
		quiet: true
	},
	devtool: "source-map"
};
