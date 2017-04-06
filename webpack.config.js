var path = require('path');
var webpack = require('webpack');

module.exports = {
  regular: {
    devtool: 'source-map',
    output: {
     filename: 'meyda.js'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          //exclude: /node_modules/, <-- include node_modules because of jsfft's ES6 push to npm 😡
          loader: 'babel-loader',
          options: {
            presets: [[ 'es2015', { modules: false } ]]
          }
        }
      ]
    }
  },
  minified: {
    devtool: 'source-map',
    output: {
     filename: 'meyda.min.js',
     sourceMapFilename: 'meyda.min.map'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          //exclude: /node_modules/, <-- include node_modules because of jsfft's ES6 push to npm 😡
          loader: 'babel-loader',
          options: {
            presets: [[ 'es2015', { modules: false } ]]
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