var gulp = require('gulp');
var babel = require('gulp-babel');
var webpack = require('webpack-stream');

gulp.task('buildNode',function(){
  return gulp.src('./src/**/*.js')
    .pipe(babel({
      presets: ['@babel/preset-env'],
      plugins: ['babel-plugin-add-module-exports']
    }))
    .pipe(gulp.dest('./dist/node/'));
});

gulp.task('buildWeb', function() {
  return gulp.src('./src/index.js')
    .pipe(webpack({
      config: require('./webpack.config.js')
    }))
    .pipe(gulp.dest('./dist/web'));
});
gulp.task('build', gulp.parallel('buildNode', 'buildWeb'));
