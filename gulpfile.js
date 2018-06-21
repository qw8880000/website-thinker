var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var pump = require('pump');
var concat = require('gulp-concat');
var merge = require('merge-stream');

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
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./css'));
});

gulp.task('postcss', function () {
  return gulp.src('./css/app.css')
    .pipe(postcss([ autoprefixer() ]))
    .pipe(gulp.dest('./css'));
});

gulp.task('minify-css', function () {
  return gulp.src('./css/app.css')
    .pipe(cleanCSS())
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('minify-js', function () {
  var jsWaitMinify = gulp.src('./js/*.js')
    .pipe(uglify());

  var jsMinified = gulp.src('./js/vendor/*.js');

  merge(jsWaitMinify, jsMinified)
    .pipe(concat('app.min.js'))
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('default', function() {
  // 将你的默认的任务代码放在这
});