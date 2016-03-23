/**
 * Config Section - Tasks configuration values
 */

var path = require('path');

var BASE_DIR = path.resolve(__dirname, '..');
var APP_ROOT = path.join(BASE_DIR, 'app');
var BOWER_COMPONENTS_PATH = path.join(APP_ROOT,  '/lib');
var DIST_ROOT = 'public';

module.exports = {
    DIST_ROOT : DIST_ROOT,
    APP_ROOT : APP_ROOT,
    BOWER_COMPONENTS_PATH : BOWER_COMPONENTS_PATH,
    source  : {
        'less': {
            'src': path.join(APP_ROOT, '/less/[^_]*.less'),
            'includes' : {
                'all': path.join(APP_ROOT, '/less/includes/_*.less'),
                'root': path.join(APP_ROOT, '/less/includes/')
            },
            'components' : {
                'all': path.join(APP_ROOT, '/less/components/_*.less'),
                'root': path.join(APP_ROOT, '/less/components/')
            },
            'all': path.join(APP_ROOT, '/less/**/*.less'),
            'root': path.join(APP_ROOT, '/less/')
        },
        'javascript': {
            'files': path.join(APP_ROOT, '/js/**/*.js'),
            'templates': '!' + path.join(APP_ROOT, '/js/trulii.templates.js'),
            'root': path.join(APP_ROOT, '/js/')
        },
        'css': {
            'files': path.join(APP_ROOT, '/css/**/[^_]*.css'),
            'fonts': path.join(APP_ROOT, '/css/fonts/**/*'),
            'img': path.join(APP_ROOT, '/css/img/**/*'),
            'root' : path.join(APP_ROOT, '/css/')
        },
        'html': {
            'index': path.join(APP_ROOT, '/index.html'),
            'partials': path.join(APP_ROOT, '/partials/**/*.html')
        }
    },
    localDependencies : [
        path.join(APP_ROOT, '/js/trulii.js'),
        path.join(APP_ROOT, '/js/trulii.*.js'),
        path.join(APP_ROOT, '/js/**/*.module.js'),
        path.join(APP_ROOT, '/js/**/*.config.js'),
        path.join(APP_ROOT, '/js/**/services/**.js'),
        path.join(APP_ROOT, '/js/**/directives/*.directive.js'),
        path.join(APP_ROOT, '/js/**/filters/*.filter.js'),
        path.join(APP_ROOT, '/js/**/controllers/*.controller.js')
    ],
    dist : {
        "css": {
            "files": path.join(DIST_ROOT, '/css/*.css'),
            "root": path.join(DIST_ROOT, '/css'),
            "fonts": path.join(DIST_ROOT, '/css/fonts'),
            "img": path.join(DIST_ROOT, '/css/img')
        },
        'javascript': path.join(DIST_ROOT, '/js'),
        'html': {
            'index': path.join(DIST_ROOT, '/index.html'),
            'partials': path.join(DIST_ROOT, '/partials')
        },
        'all': DIST_ROOT
    },
    lessConfig : {
        paths: [
            path.join(BOWER_COMPONENTS_PATH, '/bootstrap/less'),
            path.join(BOWER_COMPONENTS_PATH, '/bootstrap-material-design/less'),
            path.join(BOWER_COMPONENTS_PATH, '/toastr')
        ]
    },
    htmlMin : {
        collapseWhitespace: true,
        removeComments: true
    },
    htmlify : {
        customPrefixes: ['ui-', 'trul-', 'trulii-'],
        verbose: false
    },
    gzip: {
        src: DIST_ROOT + '/**/*.{html,xml,json,css,js}',
        dest: DIST_ROOT,
        options: {}
    },
    ngDocs: {
        root : path.join(BASE_DIR, '/docs/'),
        port : 9000
    },
    uiFramework: {
        root : path.join(BASE_DIR, '/ui-framework/'),
        port : 9001
    },
    karma: {
        root : path.join(BASE_DIR, '/karma.conf.js'),
    }
};
