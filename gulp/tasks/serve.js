/**
 * Serve Section - Serve and watch related modules, values and tasks
 * */

var gulp = require('gulp');
var gutil = require('gulp-util');
var connect = require('gulp-connect');
var modRewrite = require('connect-modrewrite');

var source = require('../config').source;
var APP_ROOT = require('../config').APP_ROOT;
var DIST_ROOT = require('../config').DIST_ROOT;

gulp.task('connect', function() {
    var path = null;
    if(gutil.env.release){
        path = DIST_ROOT;
    } else {
        path = APP_ROOT;
    }

    gutil.log('Starting server on ' + path);
    connect.server({
        root: APP_ROOT,
        port: 8080,
        livereload: true,
        fallback: source.html.index,
        middleware: function() {
            return [
                modRewrite([
                    '^[^\\.]*$ /index.html [L]'
                ])
            ];
        }
    });
    gutil.log('env.dist:', !!gutil.env.dist);
});

/** Watch these files for changes and run the task on update **/
gulp.task('watch', function() {
    gutil.log('Starting watch on ' + source.javascript.root + ' and ' + source.less.root);
    gulp.watch([source.html.index, source.html.partials], ['on-html-livereload']);
    gulp.watch(source.javascript.files, ['source-js-injector', 'compile-ngdocs']);
    gulp.watch(source.less.all, ['source-css-injector']);
});

/** Serve Documentation Tasks (ng-docs, styleguide) **/
gulp.task('serve-docs', ['serve-ngdocs', 'serve-uiframework']);

gulp.task('serve-all', ['serve', 'serve-ngdocs', 'serve-uiframework']);

/** Serve task for development mode **/
gulp.task('serve', ['less-compile', 'injector', 'connect', 'watch']);