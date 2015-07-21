var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps");
var babel = require("gulp-babel");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var browserify = require('browserify');
var through2 = require('through2');
var babelify = require('babelify');

gulp.task('buildWeb',function(){
	return gulp.src('./src/main.js')
		.pipe(through2.obj(function(file,enc,next){
			browserify(file.path,{debug: process.env.NODE_ENV === 'development'})
				.transform(babelify)
				.bundle(function (err, res){
					if(err){
						return next(err);
					}
					file.contents = res;
					next(null,file);
				});
		}))
		.on('error', function(error){
			console.log(error.stack);
			this.emit('end')
		})
		.pipe(concat("meyda.js"))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./dist/web/'));
})

gulp.task('buildNode',function(){
	return gulp.src("./src/**/*.js")
		.pipe(babel())
		.pipe(gulp.dest("./dist/node/"));
});

gulp.task('uglifyWeb',function(){
	return gulp.src("./dist/web/meyda.js")
		.pipe(uglify())
		.pipe(concat("meyda.min.js"))
		.pipe(gulp.dest("./dist/web/"))
});
