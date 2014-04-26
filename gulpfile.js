var gulp = require('gulp');
var karma = require('gulp-karma');

var testFiles = [
  'src/**/*.js',
  'test/**/*.js'
];

/* Set up tasks */
gulp.task('test', function() {
  // Be sure to return the stream
  return gulp.src(testFiles)
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run'
    }));
});

gulp.task('watch', function() {
  gulp.src(testFiles)
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'watch'
    }));
});

gulp.task('default', ['watch'], function() {
});

