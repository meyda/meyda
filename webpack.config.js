/* global module process require */
var path = require('path');
var webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = [
  {
    name: 'regular',
    entry: './src/index.js',
    mode: process.env['NODE_ENV'] || 'development',
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
  {
    name: 'minified',
    entry: './src/index.js',
    mode: process.env['NODE_ENV'] || 'development',
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
        new TerserPlugin({
          parallel: true,
          terserOptions: {
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
];
