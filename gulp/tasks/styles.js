/**
 * Styles Section - Styles related modules, values and tasks
 * */

var gulp = require('gulp');
var gutil = require('gulp-util');
var connect = require('gulp-connect');
var sourcemaps = require('gulp-sourcemaps');
var plumber = require('gulp-plumber');
var less = require('gulp-less');
var inject = require('gulp-inject');
var mainBowerFiles = require('main-bower-files');
var minifyCSS = require('gulp-minify-css');
var size = require('gulp-filesize');

var source = require('../config').source;
var BASE_DIR = require('../config').BASE_DIR;
var APP_ROOT = require('../config').APP_ROOT;
var BOWER_COMPONENTS_PATH = require('../config').BOWER_COMPONENTS_PATH;
var LESS_CONFIG = require('../config').lessConfig;

/** Task to compile '.less' files **/
gulp.task('less-compile', function () {

    return gulp.src(source.less.src)
        .pipe(plumber())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(less(LESS_CONFIG))
        .on('error', function (err) {
            gutil.log('on.error: ');
            gutil.log(err);
            this.emit('end');
        })
        .pipe(size())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(source.css.root));

});

/** Injector Task for .css file from Bower Dependencies **/
gulp.task('bower-css-injector', function() {

    var filter = '**/*.css';
    /* Filters to exclude bootstrap and bootstrap-material-design css files
     *  since it's .less files are being used */
    var filterExcludeBootstrap = '!**/bootstrap/**';
    var filterExcludeMaterial = '!**/bootstrap-material-design/**';
    var filterExcludeToastr = '!**/toastr/**';
    var filterNgTagsInput = '!**/ng-tags-input/**';
    var filterArr = [filter, filterExcludeBootstrap, filterExcludeMaterial,
        filterExcludeToastr, filterNgTagsInput];

    var injectParams = {name: 'inject:bower', relative: true};
    var srcParams = { base: BOWER_COMPONENTS_PATH, read: false };
    var target = gulp.src(source.html.index);
    var sources = gulp.src(mainBowerFiles(filterArr), srcParams);
    gutil.log(mainBowerFiles(filterArr));

    return target.pipe(inject(sources, injectParams))
        .pipe(gulp.dest(APP_ROOT));

});

/** Injector Task for .css file generated from .less inside source **/
gulp.task('source-css-injector', ['less-compile'], function() {

    var injectParams = {relative: true};
    var srcParams = { read: false };
    var target = gulp.src(source.html.index);
    var sources = gulp.src(source.css.files, srcParams);

    return target.pipe(inject(sources, injectParams))
        .pipe(gulp.dest(APP_ROOT))
        .pipe(connect.reload());

});

/** Meta Injector Task for .css files (Bower and source) **/
gulp.task('css-injector', ['bower-css-injector', 'source-css-injector'], function() {

    var injectParams = {relative: true};
    var srcParams = { read: false };
    var target = gulp.src(source.html.index);
    var sources = gulp.src(source.css.files, srcParams);

    return target.pipe(inject(sources, injectParams))
        .pipe(gulp.dest(APP_ROOT));

});