'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var browserSync = require('browser-sync').create();
var paths = {
  assets: __dirname + '/assets',
  sass: __dirname + '/sass',
  css: __dirname + '/css'
}


// Default / main task
gulp.task('default', function(cb) {
  // run sass, run lint , build javascripts
  runSequence('styles:prod', 'lint', 'javascripts', cb);
});

// CSS / SASS BUILD
gulp.task('styles:dev', function(){
  del.sync([paths.css]);
  return gulp.src(paths.css + '/styles.css')
  .pipe($.compass({
    config_file: 'config.rb',
    css: paths.css,
    sourcemap: true,
    style: 'expanded'
  }));
});

gulp.task('styles:prod', function(){
  del.sync([paths.css]);
  return gulp.src(paths.css + '/styles.css')
  .pipe($.compass({
    config_file: 'config.rb',
    css: paths.css,
    sourcemap: true,
    style: 'compressed'
  }));
});

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

gulp.task('javascripts', function(cb){
  runSequence('js:contrib', 'js:plugins', 'js:app', cb);
});

gulp.task('js:contrib', function(){
    gulp.src(paths.assets + '/js/contrib/*')
      .pipe($.filter('*.js'))
      .pipe($.concat('libs.js'))
      .pipe($.uglify())
      .pipe(gulp.dest(paths.assets + 'js'));
});

gulp.task('js:plugins', function(){
    gulp.src(paths.assets + '/js/plugins/*')
      .pipe($.filter('*.js'))
      .pipe($.concat('plugins.js'))
      .pipe($.uglify())
      .pipe(gulp.dest(paths.assets + 'js'));
});

gulp.task('js:app', function(){
    gulp.src(paths.assets + '/js/app/*')
      .pipe($.filter('*.js'))
      .pipe($.concat('main.js'))
      .pipe($.uglify())
      .pipe(gulp.dest(paths.assets + 'js'));
});

// Browser sync to watch for tasks and rebuild
gulp.task('browsersync', ['default'], function() {
  browserSync.init({proxy: "localhost"});
  gulp.watch([paths.sass + '/**/*.scss', paths.assets + '/**/*.js'], function() {
    runSequence('default', browserSync.reload);
  });
});
