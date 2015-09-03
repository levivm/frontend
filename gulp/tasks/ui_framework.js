/**
 * ui-framework Connect Task for UI components framework documentation, can be accessed through 'ui-framework/'
 **/

var gulp = require('gulp');
var gutil = require('gulp-util');
var connect = require('gulp-connect');
var config = require('../config').uiFramework;
var APP_ROOT = require('../config').APP_ROOT;

gulp.task('serve-uiframework', function() {
    gutil.log('Starting server on ' + config.port);
    connect.server({
        root: [config.root, APP_ROOT],
        port: config.port,
        livereload: true
    });
});