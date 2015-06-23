var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps");
var babel = require("gulp-babel");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");

gulp.task('default',function(){
  var babel = require("gulp-babel");
  return gulp.src("src/**/*.js")
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(concat("meyda.js"))
    .pipe(uglify())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist"));
});
