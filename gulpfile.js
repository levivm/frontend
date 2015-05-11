
/* Gulp main Modules */

var gulp  = require('gulp');
var gutil = require('gulp-util');
var debug = require('gulp-debug');
var gulpif = require('gulp-if');
var sourcemaps = require('gulp-sourcemaps');
var DEBUG_OPTS = {title: 'unicorn:'};
//Usage .pipe(debug(DEBUG_OPTS))
var plumber = require('gulp-plumber');
/* Gulp Inject Modules */

var inject = require('gulp-inject');
var mainBowerFiles = require('main-bower-files');

/* Check for debug flag */
var isRelease  = false;

// If "release" is passed from the command line then update the defaults
if(gutil.env._[0] === 'release') {
    isRelease  = true;
}

/* Filesystem related Modules and Values */

var watch = require('gulp-watch');
var connect = require('gulp-connect');
var path = require('path');
var del = require('del');
var size = require('gulp-filesize');

var DIST_ROOT = 'public';
var APP_ROOT = 'app';
var BOWER_COMPONENTS_PATH = APP_ROOT +  '/lib';

var source  = {
    'less': {
        'src': APP_ROOT + '/less/[^_]*.less',
        'includes' : {
            'all': APP_ROOT + '/less/includes/_*.less',
            'root': APP_ROOT + '/less/includes/'
        },
        'components' : {
            'all': APP_ROOT + '/less/components/_*.less',
            'root': APP_ROOT + '/less/components/'
        },
        'all': APP_ROOT + '/less/**/*.less',
        'root': APP_ROOT + '/less/'
    },
    'javascript': {
        'files': APP_ROOT + '/js/**/*.js',
        'root': APP_ROOT + '/js/'
    },
    'css': {
        'files': APP_ROOT + '/css/**/[^_]*.css',
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

/*
 * Styles Section - Styles related modules, values and tasks
 * */

/* LESS and CSS related Modules */
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');

var LESS_CONFIG = {
    paths: [
        path.join(__dirname, BOWER_COMPONENTS_PATH, '/bootstrap/less'),
        path.join(__dirname, BOWER_COMPONENTS_PATH, '/bootstrap-material-design/less'),
        path.join(__dirname, BOWER_COMPONENTS_PATH, '/toastr'),
//        path.join(__dirname, source.less.includes.root),
//        path.join(__dirname, source.less.components.root),
//        path.join(__dirname, source.less.root)
    ]
};

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
//        .pipe(livereload())
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

/*
 * Javascript Section - Javascript related modules, values and tasks
 * */

/* Javascript related Modules */
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');

/** Javascript related Tasks **/

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
        .pipe(gulpif(isRelease, uglify()))
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
    var filter = '**/*.js';
    var jQueryFilter = '**/jquery/**/*.js';
    var jQueryExcludeFilter = '!' + jQueryFilter;
    var injectParams = {name: 'inject:bower', relative: true};
    var srcParams = { base: BOWER_COMPONENTS_PATH, read: false };
    var target = gulp.src(source.html.index);
    var sources = gulp.src(mainBowerFiles([filter, jQueryExcludeFilter]), srcParams);

    var injectjQueryParams = {name: 'inject:head', relative: true};
    var sourcesJquery = gulp.src(mainBowerFiles(jQueryFilter), srcParams);


    return target.pipe(inject(sourcesJquery, injectjQueryParams)).pipe(inject(sources, injectParams))
        .pipe(gulp.dest(APP_ROOT));
});

/** Injects .js sources inside '<!-- inject:js -->' tag **/
gulp.task('source-js-injector', function () {
    var injectParams = {relative: true};
    var target = gulp.src(source.html.index);
    var sources = gulp.src(localDependencies, {read: false, relative: true});

    return target.pipe(inject(sources, injectParams))
        .pipe(gulp.dest(APP_ROOT))
//        .pipe(livereload())
        .pipe(connect.reload());
});

/** Meta Task for .js files injection (Bower and sources) **/
gulp.task('js-injector', ['bower-js-injector', 'source-js-injector'], function () {
});

/*
 * HTML Section - HTML related modules, values and tasks
 * */

/* HTML related Modules */

var minifyHTML = require('gulp-minify-html');
var htmlify = require('gulp-angular-htmlify');

/* HTML related configuration objects */

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

/* HTML related Tasks */

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

/*
 * ng-docs Section - ng-docs related modules, values and tasks
 * */

var gulpDocs = require('gulp-ngdocs');

var NG_DOCS_ROOT = __dirname + '/docs/';
var NG_DOCS_PORT = 9000;

/* ng-docs Tasks */

/** ng-docs generation Task **/
gulp.task('compile-ngdocs', [], function () {
    var ngDocsOptions = {
        html5Mode: false,
        startPage: '/api',
        title: "Trulii Angular Docs",
        image: __dirname + "/logo-ii-yellow.png",
        imageLink: "/api",
        titleLink: "/api"
    };

    return gulp.src(source.javascript.files)
        .pipe(gulpDocs.process(ngDocsOptions))
        .pipe(gulp.dest(NG_DOCS_ROOT))
//        .pipe(livereload())
        .pipe(connect.reload());
});

/** ng-docs Connect Task for documentation, can be accessed through 'api/' **/
gulp.task('serve-ngdocs', function() {
    gutil.log('Starting server on ' + NG_DOCS_ROOT);
    connect.server({
        root: NG_DOCS_ROOT,
        port: NG_DOCS_PORT,
        livereload: true
    });
});

var STYLEGUIDE_ROOT = __dirname + '/styleguide/';
var STYLEGUIDE_PORT = 9001;

/** ng-docs Connect Task for documentation, can be accessed through 'api/' **/
gulp.task('serve-styleguide', function() {
    gutil.log('Starting server on ' + STYLEGUIDE_PORT);
    connect.server({
        root: [STYLEGUIDE_ROOT, APP_ROOT],
        port: STYLEGUIDE_PORT,
        livereload: true
    });
});


/* Gulp Core Tasks */

/** Clean task to remove everything from public **/
gulp.task('clean', function(cb) {
    del([dist.all], cb);
});

gulp.task('connect', function() {
    var modRewrite = require('connect-modrewrite');
    var path = null;
    if(isRelease){
        path = DIST_ROOT + '/';
    } else {
        path = APP_ROOT + '/';
    }

    gutil.log('Starting server on ' + path);

    connect.server({
        root: APP_ROOT,
        port: 8080,
        livereload: true,
        fallback: path + 'index.html',
        middleware: function() {
            return [
                modRewrite([
                    '^[^\\.]*$ /index.html [L]'
                ])
            ];
        }
    });
});

/** Meta Task to inject dependencies **/
gulp.task('injector', ['css-injector', 'js-injector']);

/** Task to build resources from APP to DIST **/
gulp.task('build', ['injector']);

/** Watch these files for changes and run the task on update **/
gulp.task('watch', function() {
//    livereload.listen();
    gutil.log('Starting watch on ' + source.javascript.root + ' and ' + source.less.root);
    gulp.watch([source.html.index, source.html.partials], ['on-html-livereload']);
    gulp.watch(source.javascript.files, ['source-js-injector', 'compile-ngdocs']);
    gulp.watch(source.less.all, ['source-css-injector']);
});

/** Serve Documentation Tasks (ng-docs styleguide) **/
gulp.task('serve-docs', ['serve-ngdocs', 'serve-styleguide']);

gulp.task('serve-all', ['serve', 'serve-ngdocs', 'serve-styleguide']);

/** Serve task for development mode **/
gulp.task('serve', ['less-compile', 'injector', 'connect', 'watch']);

/** Default Task, run serve when gulp is called without arguments **/
gulp.task('default', ['serve']);