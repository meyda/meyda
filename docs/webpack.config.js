module.exports = {
  entry: "./src/main.js",
  output: {
    path: __dirname,
    filename: "./assets/main.js"
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
};
