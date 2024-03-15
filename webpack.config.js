const webpack = require('webpack');

const use = {
    test: /js$/,
    exclude: /node_modules/,
    loader: 'babel-loader',
    options: {
        presets: [
            ['@babel/preset-env', {
                targets: "defaults"
            }],
            ['@babel/preset-react', {"runtime": "automatic"}]
        ]
    }
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
	mode: "development"
};

module.exports = [browserConfig, serverConfig];