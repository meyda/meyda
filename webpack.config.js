var path = require('path');
var webpack = require('webpack');

module.exports = {
  regular: {
    devtool: 'source-map',
    output: {
     filename: 'meyda.js',
     library: 'Meyda',
     libraryTarget: 'var'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            presets: ['es2015'],
            plugins: [
              'add-module-exports'
            ]
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
     libraryTarget: 'var'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            presets: ['es2015'],
            plugins: [
              'add-module-exports'
            ]
          }
        }
      ]
    },
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: true,
          drop_console: false
        },
        sourceMap: true
      })
    ]
  }
};