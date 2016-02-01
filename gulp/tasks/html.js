/**
 * HTML Section - HTML related modules, values and tasks
 * */

var gulp  = require('gulp');
var debug = require('gulp-debug');
var connect = require('gulp-connect');
var htmlMin = require('gulp-htmlmin');
// To add `data-` prefix to ng-* attributes
var htmlify = require('gulp-angular-htmlify');
var templateCache = require('gulp-angular-templatecache');

var source = require('../config').source;
var dist = require('../config').dist;
var HTMLIFY_CONF = require('../config').htmlify;
var HTML_MIN_CONF = require('../config').htmlMin;

/** Livereload Task for .html files **/
gulp.task('on-html-livereload', ['minify-html-partials'], function() {
    return gulp.src([source.html.index, source.html.partials])
        .pipe(connect.reload());
});

/** Minification Task for .html index file **/
gulp.task('minify-html-index', function() {
    return gulp.src(dist.html.index)
        .pipe(htmlify(HTMLIFY_CONF))
        .pipe(htmlMin(HTML_MIN_CONF))
        .pipe(gulp.dest(dist.all));
});

/** Minification and Angular Cache Task for .html partials files **/
gulp.task('minify-html-partials', function() {
    var templateFilename = "trulii.templates.js";
    var templateCacheOptions = {
        'standalone': true,
        'root': 'partials/',
        'moduleSystem': 'IIFE'
    };
    return gulp.src(source.html.partials)
        .pipe(htmlify(HTMLIFY_CONF))
        .pipe(htmlMin(HTML_MIN_CONF))
        .pipe(templateCache(templateFilename, templateCacheOptions))
        .pipe(debug({'title': "Angular template cache file created"}))
        .pipe(gulp.dest(source.javascript.root));
});