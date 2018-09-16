var path = require('path');
var webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  regular: {
    devtool: 'source-map',
    output: {
     filename: 'meyda.js',
     library: 'Meyda',
     libraryTarget: 'umd'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', {modules: false}]]
          }
        }
      ]
    }
  },
  minified: {
    devtool: 'source-map',
    output: {
     filename: 'meyda.min.js',
     sourceMapFilename: 'meyda.min.map',
     library: 'Meyda',
     libraryTarget: 'umd'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', {modules: false}]]
          }
        }
      ]
    },
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          parallel: true,
          uglifyOptions: {
            compress: {
              warnings: true,
              drop_console: false
            }
          },
          sourceMap: true
        })
      ]
    }
  }
};
