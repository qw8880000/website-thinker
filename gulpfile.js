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
var gulpSequence = require('gulp-sequence');
var rev = require('gulp-rev');
var revRewrite = require('gulp-rev-rewrite');

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
// 1. minify css
// 2. css file revisioning
//
gulp.task('build-css', function () {
  return gulp.src('./css/app.css')
    .pipe(cleanCSS())
    .pipe(rename({extname: '.min.css'}))
    .pipe(rev())
    .pipe(gulp.dest('./dist/css'))
    .pipe(rev.manifest('rev-manifest-css.json'))
    .pipe(gulp.dest('./dist/manifest'));
});

//
// 1. minify javascript
// 2. concat javascirpt
//
gulp.task('build-js', function () {
  var jsMinified = gulp.src([
    './js/vendor/jquery-slim.min.js',
    './js/vendor/bootstrap.min.js',
    './js/vendor/popper.min.js'
  ]);

  var jsWaitMinify = gulp.src('./js/*.js').pipe(uglify());

  return merge(jsMinified, jsWaitMinify)
    .pipe(concat('app.min.js'))
    .pipe(rev())
    .pipe(gulp.dest('./dist/js'))
    .pipe(rev.manifest('rev-manifest-js.json'))
    .pipe(gulp.dest('./dist/manifest'));
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
// 1. html block replace
// 2. asserts revisioning
//
gulp.task('build-html', function () {
  var manifest = gulp.src('dist/manifest/*.json');

  return gulp.src('index.html')
    .pipe(htmlreplace({
      'css': 'css/app.min.css',
      'js': 'js/app.min.js'
    }))
    .pipe(revRewrite({
      manifest: manifest
    }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('clean', function () {
  return gulp.src('./dist', {read: false})
    .pipe(clean());
});

//
// watch
//
gulp.task('watch', function () {
  gulp.watch('scss/**/*.scss', ['sass']);
  gulp.watch('css/*.css', ['postcss']);
});

gulp.task('default', gulpSequence(
  'sass',
  'postcss',
  'watch'
));

gulp.task('build', gulpSequence(
  'clean',
  'sass',
  'postcss',
  'build-css',
  'build-js',
  'imagemin',
  'build-html'
));