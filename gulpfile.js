
var gulp = require('gulp');
var debug = require ( 'gulp-debug' );
//var watchLess = require('gulp-watch-less');
var watch = require('gulp-watch');
var less = require('gulp-less');
var plumber = require('gulp-plumber');

var path = require('path');



// *********** Settings ***********

// LESS

var BOOTSTRAP_LESS_FILES_PATH = 'bower_components/bootstrap/less';
var BOOTSTRAP_MATERIAL_LESS_FILES_PATH = 'bower_components/bootstrap-material-design/less';
var TOASTR_PATH = 'bower_components/toastr';

var LESS_CONFIG = {
    paths: [
        path.join(__dirname, BOOTSTRAP_LESS_FILES_PATH),
        path.join(__dirname, BOOTSTRAP_MATERIAL_LESS_FILES_PATH),
        path.join(__dirname, TOASTR_PATH)
    ]
}

var LESS_OUTPUT = 'public/css'


// *********** Tasks ***********

// Watch changes on Less files

gulp.task('less.watch', function () {

    watch('less/**/*.less', function(){
        gulp.src('less/trulii.less')  // TODO: RegExp for files that don't begin with an underscore
        .pipe(plumber())
        .pipe(less(LESS_CONFIG))
        .pipe(gulp.dest(LESS_OUTPUT));
    });
        
});

// Less files to CSS

gulp.task('less.compile', function () {
    return gulp.src('less/trulii.less')        
        .pipe(less(LESS_CONFIG))
        .pipe(gulp.dest(LESS_OUTPUT));
});