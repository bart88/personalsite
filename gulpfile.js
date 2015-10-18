'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var browserSync = require('browser-sync').create();
var paths = {
  assets: __dirname + '/assets',
  sass: __dirname + '/sass'
};

// Default / main task
gulp.task('default', function(cb)) {
  // run sass, run lint , build javascripts
  runSequence();
}

// Lint Sass and JavaScript.
gulp.task('lint', function(cb) {
  runSequence('lint:js', 'lint:sass', cb);
});

gulp.task('lint:js', function() {
  return gulp.src(paths.assets + '/js/**/*')
    .pipe($.eslint())
    .pipe($.eslint.format());
});

gulp.task('lint:sass', function() {
  return gulp.src(paths.sass + '/**/*.scss')
    .pipe($.scssLint({bundleExec: true, config: '.scss-lint.yml'}));
});
