var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps");
var babel = require("gulp-babel");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var browserify = require('browserify');

gulp.task('buildWeb',function(){
  var b = browserify({
    entries: './src/main.js',
    debug: true
  });

  return b.bundle()
    .pipe(source('./src/**/*.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        .pipe(babel())
        .on('error', gutil.log)
    .concat("meyda.js")
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/web/'));
})

gulp.task('buildNode',function(){
  return gulp.src("./src/**/*.js")
    .pipe(babel())
    .pipe(gulp.dest("./dist/node/"));
});

gulp.task('minifyBuiltBrowserifyOutput',function(){
  return gulp.src("dist/web/meyda.js")
    .pipe(uglify())
    .pipe(concat("meyda.min.js"))
    .pipe(gulp.dest("./dist/web/"))
});
