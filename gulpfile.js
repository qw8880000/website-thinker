var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('imagemin', function() {
  return gulp.src('./images/**/*')
  .pipe(imagemin([
    imagemin.jpegtran({progressive: true}),
    imagemin.optipng({optimizationLevel: 5})
  ], {
	  verbose: true
  }))
  .pipe(gulp.dest('./build/images'))
});

gulp.task('sass', function () {
  return gulp.src('./scss/app.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./css'));
});

gulp.task('default', function() {
  // 将你的默认的任务代码放在这
});