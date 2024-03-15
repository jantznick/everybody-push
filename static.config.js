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

const staticConfig = {
	entry: "./staticRender.js",
	output: {
	  path: __dirname,
	  filename: "./public/js/static.js"
	},
	devtool: "cheap-module-source-map",
	module: {
		rules: [use]
	},
	mode: "development"
}

module.exports = staticConfig;