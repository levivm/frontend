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
var temp = require('../config').temp;
var HTMLIFY_CONF = require('../config').htmlify;
var HTML_MIN_CONF = require('../config').htmlMin;

/** Livereload Task for .html files **/
gulp.task('on-html-livereload', function() {
    return gulp.src([source.html.index, source.html.partials])
        .pipe(connect.reload());
});

/** Minification Task for .html index file **/
gulp.task('minify-html-index', function() {
    return gulp.src(source.html.index)
        .pipe(htmlify(HTMLIFY_CONF))
        .pipe(htmlMin(HTML_MIN_CONF))
        .pipe(gulp.dest(dist.html.index));
});

/** Minification and Angular Cache Task for .html partials files **/
gulp.task('minify-html-partials', function() {
    return gulp.src(source.html.partials)
        .pipe(htmlify(HTMLIFY_CONF))
        .pipe(htmlMin(HTML_MIN_CONF))
        .pipe(templateCache())
        .pipe(debug({'title': "Angular template cache file created"}))
        .pipe(gulp.dest(temp.javascript.partials));
});

/** Meta Task for .html files minification **/
gulp.task('minify-html', ['clean', 'minify-html-index', 'minify-html-partials']);