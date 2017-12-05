var path = require('path');
var webpack = require('webpack');

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
            presets: [['env', {modules: false}]]
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
            presets: [['env', {modules: false}]]
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
