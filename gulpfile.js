var gulp = require('gulp');
var imagemin = require('gulp-imagemin');

gulp.task('imagemin', function() {
  gulp.src('images-raw/**/*')
  .pipe(imagemin([
    imagemin.jpegtran({progressive: true}),
    imagemin.optipng({optimizationLevel: 5})
  ], {
	  verbose: true
  }))
  .pipe(gulp.dest('images'))
});

gulp.task('default', function() {
  // 将你的默认的任务代码放在这
});