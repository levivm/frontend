/**
 * Javascript Section - Javascript related modules, values and tasks
 * */

var gulp  = require('gulp');
var gutil = require('gulp-util');
var gulpif = require('gulp-if');
var del = require('del');
var inject = require('gulp-inject');
var mainBowerFiles = require('main-bower-files');
var sourcemaps = require('gulp-sourcemaps');
var ngConfig = require('gulp-ng-config');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var connect = require('gulp-connect');

var source = require('../config').source;
var dist = require('../config').dist;
var localDependencies = require('../config').localDependencies;
var APP_ROOT = require('../config').APP_ROOT;
var BOWER_COMPONENTS_PATH = require('../config').BOWER_COMPONENTS_PATH;

/** Tasks to run .js source files through jshint **/
gulp.task('jshint', function() {
    return gulp.src(source.javascript.files)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

//TODO needs work
/* NICE TO HAVE: https://github.com/hparra/gulp-rename */
/** concat javascript files, minify if --type production **/
gulp.task('build-js', ['clean'], function() {
    return gulp.src(source.javascript.files)
        .pipe(sourcemaps.init())
        .pipe(concat('bundle.js'))
        //only uglify if gulp is ran with '--release'
        .pipe(gulpif(gutil.env.release, uglify()))
        .pipe(sourcemaps.write())
        .pipe(del(dist.javascript))
        .pipe(gulp.dest(dist.javascript))
        .pipe(size());
});

/* TODO REWORK. Should concatenate and minify all bower .js files that are not .min.
 * an then inject it on index.html. */
gulp.task('build-vendor-js', function() {
    return gulp.src('vendor/*.js')
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('build'))
        .pipe(uglify())
        .pipe(rename('vendor.min.js'))
        .pipe(del('build'))
        .pipe(gulp.dest('build'))
        .on('error', gutil.log)
        .pipe(size());
});

/** Injects .js files from Bower dependencies inside '<!-- inject:bower:js -->' tag **/
gulp.task('bower-js-injector', function() {

    var target = gulp.src(source.html.index);
    var srcParams = { base: BOWER_COMPONENTS_PATH, relative: true };

    // Filter globs
    var filter = '**/*.js';
    var jQueryFilter = '**/jquery/**/*.js';
    var jQueryExcludeFilter = '!' + jQueryFilter;

    //Inject into Body
    var injectParams = { name: 'inject:bower', relative: true};
    var sources = gulp.src(mainBowerFiles([filter, jQueryExcludeFilter]), srcParams);
    gutil.log('bower-js-injector.sources:', mainBowerFiles([filter, jQueryExcludeFilter]));

    // Inject into head
    var injectjQueryParams = {name: 'inject:head', relative: true};
    var sourcesJquery = gulp.src(mainBowerFiles(jQueryFilter), srcParams);
    gutil.log('bower-js-injector.head.sources:', mainBowerFiles(jQueryFilter));

    return target
        .pipe(inject(sourcesJquery, injectjQueryParams))
        .pipe(inject(sources, injectParams))
        .pipe(gulp.dest(APP_ROOT));

});

/** Injects .js sources inside '<!-- inject:js -->' tag **/
gulp.task('source-js-injector', function () {
    var injectParams = {relative: true};
    var target = gulp.src(source.html.index);
    var sources = gulp.src(localDependencies, {read: false, relative: true});

    return target.pipe(inject(sources, injectParams))
        .pipe(gulp.dest(APP_ROOT))
        .pipe(connect.reload());
});

/** Meta Task for .js files injection (Bower and sources) **/
gulp.task('js-injector', ['bower-js-injector', 'source-js-injector'], function () {
});

/* Gulp Environment Specific Tasks*/

/** ServerConf file generation task
 * generates serverConf angular constant with API URL depending on environment
 * If ``--prod`` flag is set on gulp serve sets production API URL, or development API URL otherwise **/
gulp.task('serverConf-injector', function(){
    var MODULE_NAME = 'trulii.routes.config';
    var options = {
        wrap: true,
        environment: gutil.env.prod? "production" : "development"
    };

    gutil.log('serverConf-injector. options: ' +  JSON.stringify(options));

    gulp.src('./trulii.serverConf.json')
        .pipe(ngConfig(MODULE_NAME, options))
        .pipe(gulp.dest(source.javascript.root));
});
