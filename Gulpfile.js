const { src, dest, parallel } = require("gulp");
const babel = require("gulp-babel");
const webpack = require("webpack-stream");

function web() {
  return src("./src/**/*.js")
    .pipe(
      babel({
        presets: ["@babel/preset-env"],
        plugins: ["babel-plugin-add-module-exports"],
      })
    )
    .pipe(dest("./dist/node"));
}

function node() {
  return src("./src/index.js")
    .pipe(
      webpack({
        config: require("./webpack.config.js"),
      })
    )
    .pipe(dest("./dist/web"));
}

exports.web = web;
exports.node = node;
exports.default = parallel(web, node);
