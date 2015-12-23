/**
 * Styles Section - Styles related modules, values and tasks
 * */

var gulp = require('gulp');
var debug = require('gulp-debug');
var gutil = require('gulp-util');
var connect = require('gulp-connect');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var plumber = require('gulp-plumber');
var less = require('gulp-less');
var inject = require('gulp-inject');
var mainBowerFiles = require('main-bower-files');
var minifyCss = require('gulp-minify-css');
var size = require('gulp-filesize');

var config = require('../config');
var source = require('../config').source;
var APP_ROOT = require('../config').APP_ROOT;
var DIST_ROOT = require('../config').DIST_ROOT;
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
     *  since its .less files are being used */
    var filterExcludeBootstrap = '!**/bootstrap/**';
    var filterExcludeMaterial = '!**/bootstrap-material-design/**';
    var filterExcludeToastr = '!**/toastr/**';
    var filterNgTagsInput = '!**/ng-tags-input/**';
    var filterArr = [filter, filterExcludeBootstrap, filterExcludeMaterial,
        filterExcludeToastr, filterNgTagsInput];

    var injectParams = {name: 'inject:bower', relative: true};
    var srcParams = { base: BOWER_COMPONENTS_PATH, read: false };
    var sources = gulp.src(mainBowerFiles(filterArr), srcParams);
    var target = gulp.src(source.html.index);
    //gutil.log(mainBowerFiles(filterArr));

    return target.pipe(inject(sources, injectParams))
        .pipe(gulp.dest(APP_ROOT));

});

/** Injector Task for .css file generated from .less inside source **/
gulp.task('source-css-injector', ['less-compile'], function() {

    var injectParams = {relative: true};
    var srcParams = { read: false };
    var sources = gulp.src(source.css.files, srcParams);
    var target = gulp.src(source.html.index);

    return target.pipe(inject(sources, injectParams))
        .pipe(gulp.dest(APP_ROOT))
        .pipe(connect.reload());

});

/** Meta Injector Task for .css files (Bower and source) **/
gulp.task('css-injector', ['bower-css-injector', 'source-css-injector']);

/** Meta Injector Task for Production .css files (Bower and source) **/
gulp.task('css-dist-injector', ['bower-css-dist-injector', 'source-css-dist-injector']);

gulp.task('bower-css-dist-injector', function() {

    var filter = '**/*.css';
    /* Filters to exclude bootstrap and bootstrap-material-design css files
     *  since its .less files are being used */
    var filterExcludeBootstrap = '!**/bootstrap/**';
    var filterExcludeMaterial = '!**/bootstrap-material-design/**';
    var filterExcludeToastr = '!**/toastr/**';
    var filterNgTagsInput = '!**/ng-tags-input/**';
    var filterArr = [filter, filterExcludeBootstrap, filterExcludeMaterial,
        filterExcludeToastr, filterNgTagsInput];

    var injectParams = {name: 'inject:vendor', relative: true};
    var srcParams = { base: BOWER_COMPONENTS_PATH, read: false };
    var sources = gulp.src(mainBowerFiles(filterArr), srcParams);
    var target = gulp.src(config.dist.html.index);
    gutil.log(mainBowerFiles(filterArr));

    return target.pipe(inject(sources, injectParams))
        .pipe(gulp.dest(DIST_ROOT))
        .on('error', function (err) {
            gutil.log('on.error.bower: ');
            gutil.log(err);
            this.emit('end');
        })
        .pipe(debug());

});

/** **/
gulp.task('source-css-dist-injector', ['minify-css'], function(){

    var injectParams = {name: 'inject:source', relative: true};
    var srcParams = { read: false };
    var sources = gulp.src(config.dist.css.files, srcParams);
    var target = gulp.src(config.dist.html.index);

    return target.pipe(inject(sources, injectParams))
        .pipe(gulp.dest(DIST_ROOT))
        .on('error', function (err) {
            gutil.log('on.error.source: ');
            gutil.log(err);
            this.emit('end');
        })
        .pipe(debug());
});

/**  **/
gulp.task('minify-css', function() {


    var srcParams = { read: true };
    var sources = gulp.src(source.css.files, srcParams);
    var target = gulp.dest(config.dist.css.root);

    return sources
        .pipe(sourcemaps.init())
        .pipe(minifyCss())
        .pipe(rename('trulii.min.css'))
        .pipe(sourcemaps.write())
        .pipe(target)
        .pipe(debug());

});

/**  **/
gulp.task('copy-resources', ['copy-fonts', 'copy-img']);

/**  Copies Fonts from source to dist **/
gulp.task('copy-fonts', function() {

    var sources = gulp.src(config.source.css.fonts);
    var target = gulp.dest(config.dist.css.fonts);

    return sources.pipe(target);
});

/**  Copies Images from source to dist **/
gulp.task('copy-img', function() {

    var sources = gulp.src(config.source.css.img);
    var target = gulp.dest(config.dist.css.img);

    return sources.pipe(target);
});

/**  **/
gulp.task('build-styles', ['css-dist-injector', 'copy-resources']);
