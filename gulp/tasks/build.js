/**
 * Build Section - Build related modules, values and tasks
 * */

var del = require('del');
var gulp = require('gulp');
var gulpif = require('gulp-if');
var gzip   = require('gulp-gzip');
var minifyCss = require('gulp-minify-css');
var runSequence = require('run-sequence');
var uglify = require('gulp-uglify');
var useref = require('gulp-useref');
var gutil = require('gulp-util');

var config = require('../config');
var dist = require('../config').dist;

/** Clean task to remove everything from public **/
gulp.task('clean', function() {
   return del.sync([config.dist.all]);
});

/** Clean task to remove everything from public **/
gulp.task('copy-index', ['injector'], function() {
    return gulp.src(config.source.html.index).pipe(gulp.dest(config.dist.all))
});

/** Clean task to remove everything from public **/
gulp.task('copy-robots', ['injector'], function() {
    return gulp.src(config.source.txt.robots).pipe(gulp.dest(config.dist.all))
});


/** Clean task to gzip everything in public/ folder **/
gulp.task('dist-gzip', function() {
    return gulp.src(config.gzip.src)
        .pipe(gzip(config.gzip.options))
        .pipe(gulp.dest(config.gzip.dest));
});

/**
 * Task to minify and concatenate .css and .js files from vendors and source
 */
gulp.task('build-useref', function() {
    var uglyVendorOptions = { 'mangle': false };
    return gulp.src(config.source.html.index)
        .pipe(useref())
        .pipe(gulpif('*.js', uglify(uglyVendorOptions).on('error', function(e){
            console.log(e);
        })))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulp.dest(config.dist.all));
});

/** Task to build resources from APP to DIST **/
gulp.task('build', function(callback){
    runSequence('clean', 'copy-resources', 'copy-index', 'copy-robots', 'build-useref', 'minify-html-index', 'dist-gzip', callback);
});
