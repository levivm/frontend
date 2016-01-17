/**
 * Build Section - Build related modules, values and tasks
 * */

var gulp = require('gulp');
var del = require('del');

var dist = require('../config').dist;

/** Clean task to remove everything from public **/
gulp.task('clean', function(cb) {
    del([dist.all], cb);
});

/** Task to build resources from APP to DIST **/
gulp.task('build', ['injector']);