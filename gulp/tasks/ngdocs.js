/**
 * ng-docs Section - ng-docs related modules, values and tasks
 * */

var gulp = require('gulp');
var gutil = require('gulp-util');
var connect = require('gulp-connect');
var gulpDocs = require('gulp-ngdocs');
var config = require('../config').ngDocs;
var source = require('../config').source;

/** ng-docs generation Task **/
gulp.task('compile-ngdocs', [], function () {
    var ngDocsOptions = {
        html5Mode: false,
        startPage: '/api',
        title: "Trulii Angular Docs",
        image: __dirname + "/logo-ii-yellow.png",
        imageLink: "/api",
        titleLink: "/api"
    };

    return gulp.src(source.javascript.files)
        .pipe(gulpDocs.process(ngDocsOptions))
        .pipe(gulp.dest(config.root))
        .pipe(connect.reload());
});

/** ng-docs Connect Task for documentation, can be accessed through 'api/' **/
gulp.task('serve-ngdocs', function() {
    gutil.log('Starting server on ' + config.root);
    connect.server({
        root: config.root,
        port: config.port,
        livereload: true
    });
});