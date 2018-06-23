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
var rename = require('gulp-rename');
var htmlreplace = require('gulp-html-replace');
var clean = require('gulp-clean');
var gulpSequence = require('gulp-sequence')

//
// sass convert to css
//
gulp.task('sass', function () {
  return gulp.src('./scss/app.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./css'));
});

//
// 1. css autoprefixer
//
gulp.task('postcss', function () {
  return gulp.src('./css/app.css')
    .pipe(postcss([autoprefixer()]))
    .pipe(gulp.dest('./css'));
});

//
// minify css
//
gulp.task('minify-css', function () {
  return gulp.src('./css/app.css')
    .pipe(cleanCSS())
    .pipe(rename({extname: '.min.css'}))
    .pipe(gulp.dest('./dist/css'));
});

//
// 1. minify javascript
// 2. concat javascirpt
//
gulp.task('minify-js', function () {
  var jsMinified = gulp.src([
    './js/vendor/jquery-slim.min.js',
    './js/vendor/bootstrap.min.js',
    './js/vendor/popper.min.js'
  ]);

  var jsWaitMinify = gulp.src('./js/*.js').pipe(uglify());

  return merge(jsMinified, jsWaitMinify)
    .pipe(concat('app.min.js'))
    .pipe(gulp.dest('./dist/js'));
});

//
// images optimization
//
gulp.task('imagemin', function () {
  return gulp.src('./images/**/*')
    .pipe(imagemin([
      imagemin.jpegtran({progressive: true}),
      imagemin.optipng({optimizationLevel: 5})
    ], {
      verbose: true
    }))
    .pipe(gulp.dest('./dist/images'))
});

//
// html block replace
//
gulp.task('html-replace', function () {
  return gulp.src('index.html')
    .pipe(htmlreplace({
      'css': 'css/app.min.css',
      'js': 'js/app.min.js'
    }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('clean', function () {
  return gulp.src('./dist', {read: false})
    .pipe(clean());
});

gulp.task('default', function () {
  // 将你的默认的任务代码放在这
});

gulp.task('build', gulpSequence(
  'sass',
  'postcss',
  'minify-css',
  ['minify-js', 'imagemin', 'html-replace']
));