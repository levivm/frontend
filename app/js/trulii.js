(function () {
    'use strict';

    /**
     * @ngdoc object
     * @name trulii
     * @description Trulii Main Module
     */
    angular
        .module('trulii', [
            'ngAnimate',
            'ui.bootstrap',
            'LocalStorageModule',
            'angularMoment',
            'ui.utils.masks',
            'angular-loading-bar',
            'trulii.routes',
            'trulii.config',
            'trulii.authentication',
            'trulii.ui-components',
            'trulii.organizers',
            'trulii.students',
            'trulii.activities',
            'trulii.locations',
            'trulii.landing',
            'trulii.search',
            'trulii.utils',
            'trulii.payments',
            'trulii.referrals',
            'trulii.about',
            'trulii.help',
            'ngVideo', 
            'templates',
            'nvd3',
            'ui.select',
            'textAngular',
            'uiGmapgoogle-maps',
            'ui.router.metatags'
        ]);  

    angular
        .module('trulii.config', ['facebook','720kb.socialshare']);

    angular
        .module('trulii.routes', ['ui.router', 'trulii.routes.config', 'ui.router.metatags']);

    angular
        .module('trulii')
        .run(run);

    /**
     * @ngdoc function
     * @name trulii.run
     * @description Update xsrf $http headers to align with Django's defaults
     * @requires ng.$http
     */
    run.$inject = ['$http', 'LocationManager', 'Analytics', '$rootScope', '$location'];
    function run($http, LocationManager, Analytics, $rootScope, $location) {
        $http.defaults.xsrfHeaderName = 'X-CSRFToken';
        $http.defaults.xsrfCookieName = 'csrftoken';
        LocationManager.init();
        Analytics.init();
        
    }

})();
