module.exports = {
	entry: {
		index: ['@babel/polyfill', './src/index.js'],
	},
	output: {
		path: __dirname + '/dist',
		filename: '[name]_bundle.js',
	},
	devServer: {
		contentBase: __dirname + '/dist',
		port: 3335,
	},
	module: {
		rules: [
			{
				test: /\.json/,
				type: 'javascript/auto',
				use: [require.resolve('json-loader')],
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.ttf$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: false,
						},
					},
				],
			},
			{
				test: /\.(gif|svg|jpg|png)$/,
				loader: 'file-loader',
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
				},
			},
		],
	},
};
