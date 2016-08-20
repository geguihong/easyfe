var gulp = require('gulp');
// var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

gulp.task('js', function() {
  return gulp.src(['src/store.js','src/components/*.js','src/modals/*.js','src/sections/*.js','src/app.js'])
    .pipe(concat('bundle.js'))
    // .pipe(uglify())
    .pipe(gulp.dest('public/dist'))
});

gulp.task('default', function(){
  gulp.run('js');
  // Watch .js files
  gulp.watch(['src/store.js','src/components/*.js','src/modals/*.js','src/sections/*.js','src/app.js'], ['js']);
});