// Karma configuration
// Generated on Thu Feb 25 2016 08:42:19 GMT-0430 (VET)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
        'app/lib/angular/angular.js',
        'app/lib/angular-mocks/angular-mocks.js',
        'app/lib/angular-ui-router/release/angular-ui-router.js',
        'app/lib/jquery/dist/jquery.js',
        'app/lib/angular-animate/angular-animate.js',
        'app/lib/angular-bootstrap/ui-bootstrap-tpls.js',
        'app/lib/angular-cookies/angular-cookies.js',
        'app/lib/angular-facebook/lib/angular-facebook.js',
        'app/lib/lodash/lodash.js',
        'app/lib/br-validations/releases/br-validations.js',
        'app/lib/string-mask/src/string-mask.js',
        'app/lib/angular-loading-bar/build/loading-bar.js',
        'app/lib/angular-local-storage/dist/angular-local-storage.js',
        'app/lib/angular-md5/angular-md5.js',
        'app/lib/moment/moment.js',
        'app/lib/angular-scroll/angular-scroll.js',
        'app/lib/angular-socialshare/dist/angular-socialshare.min.js',
        'app/lib/angular-youtube-mb/src/angular-youtube-embed.js',
        'app/lib/arrive/src/arrive.js',
        'app/lib/bootstrap-material-design/dist/js/material.js',
        'app/lib/bootstrap-material-design/dist/js/ripples.js',
        'app/lib/google-code-prettify/bin/prettify.min.js',
        'app/lib/moment-timezone/builds/moment-timezone-with-data-2010-2020.js',
        'app/lib/ng-file-upload/angular-file-upload.js',
        'app/lib/ng-tags-input/ng-tags-input.min.js',
        'app/lib/nouislider/distribute/nouislider.js',
        'app/lib/toastr/toastr.js',
        'app/lib/angular-google-maps/dist/angular-google-maps.js',
        'app/lib/angular-input-masks/angular-input-masks-standalone.min.js',
        'app/lib/angular-moment/angular-moment.js',
        'app/lib/d3/d3.js',
        'app/lib/nvd3/build/nv.d3.js',
        'app/lib/angular-nvd3/dist/angular-nvd3.js',
        'app/lib/textAngular/dist/textAngular.js',
        'app/lib/textAngular/dist/textAngular-sanitize.js',
        'app/lib/textAngular/dist/textAngularSetup.js',
        'app/lib/moment/locale/es.js',
        'app/lib/angular-i18n/angular-locale_es-co.js',
        'app/lib/bootstrap/dist/js/bootstrap.js',
        'app/lib/ngvideo/dist/ng-video.js',
        'app/lib/karma-read-json/karma-read-json.js',
        'app/lib/ui-select/dist/select.js',
        'app/lib/rangy/rangy-core.js',
        'app/lib/rangy/rangy-classapplier.js',
        'app/lib/rangy/rangy-highlighter.js',
        'app/lib/rangy/rangy-selectionsaverestore.js',
        'app/lib/rangy/rangy-serializer.js',
        'app/lib/rangy/rangy-textrange.js',
        'app/lib/angular-google-maps/dist/angular-google-maps.js',
        'app/lib/angular-input-masks/angular-input-masks-standalone.min.js',
        'app/trulii.analytics.js',
        'app/js/trulii.js',
        'app/js/trulii.config.js',
        'app/js/trulii.routes.js',
        'app/js/trulii.serverConf.js',
        'app/js/trulii.templates.js',
        'app/js/about/about.module.js',
        'app/js/activities/activities.module.js',
        'app/js/authentication/authentication.module.js',
        'app/js/help/help.module.js',
        'app/js/landing/landing.module.js',
        'app/js/locations/locations.module.js',
        'app/js/organizers/organizers.module.js',
        'app/js/payments/payments.module.js',
        'app/js/referrals/referrals.module.js',
        'app/js/search/search.module.js',
        'app/js/students/students.module.js',
        'app/js/ui-components/ui-components.module.js',
        'app/js/utils/utils.module.js',
        'app/js/**/*.js',
        'tests/**/*.js',
        'app/partials/**/*.html',
        {pattern: 'tests/mock/*.json', watched: true, served: true, included: false}
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
        'app/partials/**/*.html': ['ng-html2js']
    },

    ngHtml2JsPreprocessor: {
      moduleName: 'templates'
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
