var BabiliPlugin = require('babili-webpack-plugin');
var path = require('path');

module.exports.default = {
    entry: './src/main.js',
    output: {
        path: './dist/web',
        filename: 'meyda.js',
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }]
    },
    devtool: 'source-map',
    debug: true // required for source-map
};

module.exports.min = {
    entry: './src/main.js',
    output: {
        path: './dist/web',
        filename: 'meyda.min.js',
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }]
    },
    devtool: 'source-map',
    debug: true, // required for source-map
    plugins: [
        new BabiliPlugin()
    ]
};