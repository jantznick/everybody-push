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

const serverConfig = {
	entry: "./serverRender.js",
	output: {
	  path: __dirname,
	  filename: "./built/server.js"
	},
	devtool: "cheap-module-source-map",
	module: {
		rules: [use]
	},
	mode: "production"
}

module.exports = serverConfig;