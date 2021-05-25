module.exports = {
  entry: "./src/main.js",
  output: {
    path: __dirname,
    filename: "./assets/main.js",
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env"],
        },
      },
    ],
  },
};
