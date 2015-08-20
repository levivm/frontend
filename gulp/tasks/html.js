/**
 * HTML Section - HTML related modules, values and tasks
 * */

var gulp  = require('gulp');
var connect = require('gulp-connect');
var minifyHTML = require('gulp-minify-html');
var htmlify = require('gulp-angular-htmlify');

var source = require('../config').source;
var dist = require('../config').dist;
var HTMLIFY_CONF = require('../config').htmlify;
var MINIFY_HTML_CONF = require('../config').minifyHtml;


/** Minification Task for .html index file **/
gulp.task('minify-html-index', function() {
    return gulp.src(source.html.index)
        .pipe(htmlify(HTMLIFY_CONF))
        .pipe(minifyHTML(MINIFY_HTML_CONF))
        .pipe(gulp.dest(dist.html.index));
});

/** Minification Task for .html partials files **/
gulp.task('minify-html-partials', function() {
    return gulp.src(source.html.partials)
        .pipe(htmlify(HTMLIFY_CONF))
        .pipe(minifyHTML(MINIFY_HTML_CONF))
        .pipe(gulp.dest(dist.html.partials));
});

/** Livereload Task for .html files **/
gulp.task('on-html-livereload', function() {
    return gulp.src([source.html.index, source.html.partials])
        .pipe(connect.reload());
});

/** Meta Task for .html files minification **/
gulp.task('minify-html', ['clean', 'minify-html-index', 'minify-html-partials']);