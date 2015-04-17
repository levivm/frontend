/** Gulp main Modules **/
var gulp  = require('gulp');
var gutil = require('gulp-util');
var debug = require('gulp-debug');
var DEBUG_OPTS = {title: 'unicorn:'};
//Usage .pipe(debug(DEBUG_OPTS))

/** Gulp Inject Modules **/
var inject = require('gulp-inject');
var mainBowerFiles = require('main-bower-files');

/** Filesystem related Modules and Values**/
var watch = require('gulp-watch');
var connect = require('gulp-connect');
var livereload = require('gulp-livereload');
var path = require('path');
var del = require('del');
var size = require('gulp-filesize');

var DIST_ROOT = 'public';
var APP_ROOT = 'app';
var BOWER_COMPONENTS_PATH = APP_ROOT +  '/lib';

var source  = {
    'less': {
        'src': APP_ROOT + '/less/[^_]*.less',
        'includes' : APP_ROOT + '/less/includes/_*.less',
        'all': APP_ROOT + '/less/**/*.less',
        'root': APP_ROOT + '/less/'
    },
    'javascript': {
        'files': APP_ROOT + '/js/**/*.js',
        'root': APP_ROOT + '/js/'
    },
    'css': {
        'files': APP_ROOT + '/css/**/*.css',
        'root' : APP_ROOT + '/css/'
    },
    'html': {
        'index': APP_ROOT + '/index.html',
        'partials': APP_ROOT + '/partials/**/*.html'
    },
    'vendorjs': DIST_ROOT +'/assets/javascript/vendor/**/*.js'
};

var localDependencies = [
    APP_ROOT + '/js/trulii.js',
    APP_ROOT + '/js/trulii.*.js',
    APP_ROOT + '/js/**/*.module.js',
    APP_ROOT + '/js/**/*.config.js',
    APP_ROOT + '/js/**/services/**.js',
    APP_ROOT + '/js/**/directives/*.directive.js',
    APP_ROOT + '/js/**/controllers/*.controller.js'
];

var dist = {
    "css": DIST_ROOT + '/css',
    'javascript': DIST_ROOT + '/js',
    'html': {
        'index' :DIST_ROOT,
        'partials': DIST_ROOT + '/partials'
    },
    'all': DIST_ROOT
};

/**
 * Styles Section - Styles related modules, values and tasks
 * **/

/** LESS and CSS related Modules **/
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');

/** Vendor LESS files path **/
var BOOTSTRAP_LESS_PATH = BOWER_COMPONENTS_PATH + '/bootstrap/less';
var BOOTSTRAP_MATERIAL_LESS_PATH = BOWER_COMPONENTS_PATH + '/bootstrap-material-design/less';

var LESS_CONFIG = {
    paths: [
        path.join(__dirname, BOOTSTRAP_LESS_PATH),
        path.join(__dirname, BOOTSTRAP_MATERIAL_LESS_PATH)
    ]
};

// Task to Watch changes on '.less' files
gulp.task('less.watch', function () {
    watch(source.less.all, function(){
        gulp.src(source.less.src)
        .pipe(less(LESS_CONFIG))
        .pipe(gulp.dest(source.css.root));
    });
});

// Task to ccompile '.less' files
gulp.task('less-compile', function () {
    return gulp.src(source.less.src)
        .pipe(less(LESS_CONFIG))
        .pipe(autoprefixer())
        .pipe(minifyCSS())
        .pipe(gulp.dest(source.css.root))
        .pipe(size());
});

// Injector for .css file from Bower Dependencies
gulp.task('bower-css-injector', function() {
    var filter = '**/*.css';
    var injectParams = {name: 'inject:bower', relative: true};
    var srcParams = { base: BOWER_COMPONENTS_PATH, read: false };
    var target = gulp.src(source.html.index);
    var sources = gulp.src(mainBowerFiles(filter), srcParams);

    return target.pipe(inject(sources, injectParams))
        .pipe(gulp.dest(APP_ROOT));
});

gulp.task('source-css-injector', ['less-compile'], function() {
    var injectParams = {relative: true};
    var srcParams = { read: false };
    var target = gulp.src(source.html.index);
    var sources = gulp.src(source.css.files, srcParams);

    return target.pipe(inject(sources, injectParams))
        .pipe(gulp.dest(APP_ROOT))
        .pipe(livereload());
});

gulp.task('css-injector', ['bower-css-injector', 'source-css-injector'], function() {
    var injectParams = {relative: true};
    var srcParams = { read: false };
    var target = gulp.src(source.html.index);
    var sources = gulp.src(source.css.files, srcParams);

    return target.pipe(inject(sources, injectParams))
        .pipe(gulp.dest(APP_ROOT));
});

/**
 * Javascript Section - Javascript related modules, values and tasks
 * **/

/** Javascript related Modules **/
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');

/* run javascript through jshint */
gulp.task('jshint', function() {
    return gulp.src(source.javascript.files)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

/* concat javascript files, minify if --type production */
gulp.task('build-js', ['clean'], function() {
    return gulp.src(source.javascript.files)
        .pipe(sourcemaps.init())
        .pipe(concat('bundle.js'))
        //only uglify if gulp is ran with '--type production'
        .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
        .pipe(sourcemaps.write())
        .pipe(del(dist.javascript))
        .pipe(gulp.dest(dist.javascript))
        .pipe(size());
});

// REWORK
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

/**
 * HTML Section - HTML related modules, values and tasks
 * **/

/** HTML related Modules **/
var minifyHTML = require('gulp-minify-html');
var htmlify = require('gulp-angular-htmlify');

var MINIFY_HTML_CONF = {
    empty: true,
    quotes: true,
    cdata: true,
    conditionals: true,
    spare:true,
    loose: true
};

var HTMLIFY_CONF = {
    customPrefixes: ['ui-', 'trul'],
    verbose: true
};

gulp.task('bower-js-injector', function() {
    var filter = '**/*.js';
    var injectParams = {name: 'inject:bower', relative: true};
    var srcParams = { base: BOWER_COMPONENTS_PATH, read: false };
    var target = gulp.src(source.html.index);
    var sources = gulp.src(mainBowerFiles(filter), srcParams);

    return target.pipe(inject(sources, injectParams))
        .pipe(gulp.dest(APP_ROOT));
});

gulp.task('source-js-injector', function () {
    var injectParams = {relative: true};
    var target = gulp.src(source.html.index);
    var sources = gulp.src(localDependencies, {read: false, relative: true});

    return target.pipe(inject(sources, injectParams))
        .pipe(gulp.dest(APP_ROOT))
        .pipe(livereload());
});

gulp.task('js-injector', ['bower-js-injector', 'source-js-injector'], function () {
});

gulp.task('minify-html-index', function() {
    return gulp.src(source.html.index)
        .pipe(htmlify(HTMLIFY_CONF))
        .pipe(minifyHTML(MINIFY_HTML_CONF))
        .pipe(gulp.dest(dist.html.index));
});

gulp.task('minify-html-partials', function() {
    return gulp.src(source.html.partials)
        .pipe(htmlify(HTMLIFY_CONF))
        .pipe(minifyHTML(MINIFY_HTML_CONF))
        .pipe(gulp.dest(dist.html.partials));
});

gulp.task('minify-html', ['clean', 'minify-html-index', 'minify-html-partials']);

/** Gulp Core Tasks **/

gulp.task('clean', function(cb) {
    del([dist.all], cb);
});

gulp.task('connect', function() {
//    var path = __dirname + '/' + APP_ROOT + '/';
    var path = APP_ROOT + '/';
    gutil.log('Starting server on ' + path);
    connect.server({
        root: path,
        livereload: true
    });
});

gulp.task('injector', ['css-injector', 'js-injector']);

/* Watch these files for changes and run the task on update */
gulp.task('watch', function() {
    livereload.listen();
    gutil.log('Starting watch on ' + source.javascript.root + ' and ' + source.less.root);
    //TODO HTML
    gulp.watch(source.javascript.files, ['source-js-injector']);
    gulp.watch(source.less.all, ['source-css-injector']);
});

/* run the watch task when gulp is called without arguments */
gulp.task('default', ['connect', 'watch']);