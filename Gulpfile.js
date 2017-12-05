var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var browserify = require('browserify');
var through2 = require('through2');
var babelify = require('babelify');
var webpack = require('webpack-stream');

gulp.task('buildWeb:regular', function() {
  return gulp.src('./src/index.js')
    .pipe(webpack(require('./webpack.config.js').regular, require('webpack'))) // pass webpack for webpack2
    .pipe(gulp.dest('./dist/web'));
});

gulp.task('buildWeb:minified', function() {
  return gulp.src('./src/index.js')
    .pipe(webpack(require('./webpack.config.js').minified, require('webpack'))) // pass webpack for webpack2
    .pipe(gulp.dest('./dist/web'));
});

gulp.task('buildNode',function(){
  return gulp.src('./src/**/*.js')
    .pipe(babel({
      presets: ['env'],
      plugins: ['babel-plugin-add-module-exports']
    }))
    .pipe(gulp.dest('./dist/node/'));
});

gulp.task('build', ['buildNode', 'buildWeb']);
gulp.task('buildWeb', ['buildWeb:regular', 'buildWeb:minified']);
