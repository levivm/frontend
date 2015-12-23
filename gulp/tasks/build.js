/**
 * Build Section - Build related modules, values and tasks
 * */

var gulp = require('gulp');
var del = require('del');
var gutil = require('gulp-util');

var config = require('../config');

/** Clean task to remove everything from public **/
gulp.task('clean', function() {
   return del.sync([config.dist.all]);
});

/** Clean task to remove everything from public **/
gulp.task('copy-index', ['injector'], function() {
    return gulp.src(config.source.html.index).pipe(gulp.dest(config.dist.all))
});

/** Task to build resources from APP to DIST **/
gulp.task('build', ['clean', 'copy-index'], function(){
    return gulp.start('build-styles');
});
