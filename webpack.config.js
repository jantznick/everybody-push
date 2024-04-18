const webpack = require('webpack');

const use = {
    test: /\.(js|jsx|tsx|ts)$/,
    exclude: /node_modules/,
    loader: 'babel-loader',
    options: {
        presets: [
            ['@babel/preset-env', {
                targets: "defaults"
            }],
            ['@babel/preset-react', {"runtime": "automatic"}],
			"@babel/preset-typescript"
        ]
    }
}

const tsUse = {
	  test: /\.tsx?$/,
	  use: 'babel-loader',
	  exclude: /node_modules/,
}

const browserConfig = {
	entry: "./clientRender.js",
	output: {
	  path: __dirname,
	  filename: "./public/js/bundle.js"
	},
	devtool: "cheap-module-source-map",
	module: {
		rules: [use]
	},
	resolve: {
		extensions: ['*', '.js', '.jsx', '.tsx', '.ts'],
	},
	mode: "development"
};

const serverConfig = {
	entry: "./serverRender.js",
	target: "node",
	output: {
	  path: __dirname,
	  filename: "./built/server.js",
	  libraryTarget: "commonjs2"
	},
	devtool: "cheap-module-source-map",
	module: {
		rules: [use]
	},
	resolve: {
		extensions: ['*', '.js', '.jsx', '.tsx', '.ts'],
	},
	mode: "development"
};

module.exports = [browserConfig, serverConfig];