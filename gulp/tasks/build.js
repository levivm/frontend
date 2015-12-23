/**
 * Build Section - Build related modules, values and tasks
 * */

var gulp = require('gulp');
var del = require('del');

var config = require('../config');

/** Clean task to remove everything from public **/
gulp.task('clean', function(cb) {
    // IMPORTANT. Without sync the 'build' task doesn't work
    del.sync([config.dist.all], cb);
});

/** Clean task to remove everything from public **/
gulp.task('copy-index', function() {
    return gulp.src(config.source.html.index).pipe(gulp.dest(config.dist.all))
});

/** Task to build resources from APP to DIST **/
gulp.task('build', ['clean', 'copy-index', 'injector', 'build-styles']);
