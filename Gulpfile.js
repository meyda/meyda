var gulp = require('gulp');
var babel = require('gulp-babel');
var webpack = require('webpack');

gulp.task('webpack', function(callback) {
	webpack(require('./webpack.config.js').default,
		function(err, stats) {
			if(err) throw new Error("webpack", err);
			callback();
		}
	);
});

gulp.task('webpack-minify', ['webpack'], function(callback) {
	webpack(require('./webpack.config.js').min,
		function(err, stats) {
			if(err) throw new Error("webpack", err);
			callback();
		}
	);
});

gulp.task('buildWeb', ['webpack', 'webpack-minify']);

gulp.task('buildNode',function(){
	return gulp.src('./src/**/*.js')
		.pipe(babel({
            presets: ['es2015'],
			plugins: ['babel-plugin-add-module-exports']
        }))
		.pipe(gulp.dest('./dist/node/'));
});

gulp.task('build', ['buildNode', 'buildWeb']);