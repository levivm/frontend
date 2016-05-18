/**
 * Javascript Section - Javascript related modules, values and tasks
 * */

var concat = require('gulp-concat');
var connect = require('gulp-connect');
var debug = require('gulp-debug');
var del = require('del');
var gulp  = require('gulp');
var gutil = require('gulp-util');
var inject = require('gulp-inject');
var jshint = require('gulp-jshint');
var mainBowerFiles = require('main-bower-files');
var ngConfig = require('gulp-ng-config');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var useref = require('gulp-useref');

var source = require('../config').source;
var localDependencies = require('../config').localDependencies;
var APP_ROOT = require('../config').APP_ROOT;
var BOWER_COMPONENTS_PATH = require('../config').BOWER_COMPONENTS_PATH;

/** Tasks to run .js source files through jshint **/
gulp.task('jshint', function() {
    return gulp.src(source.javascript.files)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

/** Injects .js files from Bower dependencies inside '<!-- inject:bower:js -->' tag **/
gulp.task('bower-js-injector', function() {
    var target = gulp.src(source.html.index);
    var srcParams = { base: BOWER_COMPONENTS_PATH, relative: true };


    // Filter globs
    var filter = '**/*.js';
    var jQueryFilter = '**/jquery/**/*.js';
    var jQueryExcludeFilter = '!' + jQueryFilter;


    // Filter globs Non Main Files in  Lib
    var localeFilter = BOWER_COMPONENTS_PATH+'/moment/locale/es.js';  // Moment locale es js
    var localeTranslateFilter = BOWER_COMPONENTS_PATH+'/angular-i18n/angular-locale_es-co.js';  // Angular Translate es
    var nonMainFiles = [localeFilter, localeTranslateFilter]


    var arrayFiles = mainBowerFiles([filter, jQueryExcludeFilter]);
    //arrayFiles = arrayFiles.contact(nonMainFiles);

    arrayFiles = _concatFiles(arrayFiles, nonMainFiles);

    //Inject into Body
    var injectParams = { name: 'inject:bower', relative: true};
    var sources = gulp.src(arrayFiles, srcParams);
    //gutil.log('bower-js-injector.sources:', mainBowerFiles([filter, jQueryExcludeFilter, localeFilter]));

    // Inject into head
    var injectjQueryParams = {name: 'inject:head', relative: true};
    var sourcesJquery = gulp.src(mainBowerFiles([jQueryFilter]), srcParams);
    //gutil.log('bower-js-injector.head.sources:', mainBowerFiles(jQueryFilter));




    return target
        .pipe(inject(sourcesJquery, injectjQueryParams))
        .pipe(inject(sources, injectParams))
        .pipe(gulp.dest(APP_ROOT));
});



/** Injects .js sources inside '<!-- inject:js -->' tag **/
gulp.task('source-js-injector', ['minify-html-partials'], function () {
    var injectParams = {relative: true};
    var target = gulp.src(source.html.index);
    var sources = gulp.src(localDependencies, {read: false, relative: true});

    return target.pipe(inject(sources, injectParams))
        .pipe(gulp.dest(APP_ROOT))
        .pipe(connect.reload());
});

/** Meta Task for .js files injection (Bower and sources) **/
gulp.task('js-injector', ['bower-js-injector', 'source-js-injector'], function () {});

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

//Internal Functions
function  _concatFiles(arrayFiles, nonMainFiles){
  for (var i = 0; i < nonMainFiles.length; i++) {
    arrayFiles.push(nonMainFiles[i])
  }
  return arrayFiles;
}
