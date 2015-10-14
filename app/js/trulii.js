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
            'trulii.config',
            'trulii.routes',
            'trulii.authentication',
            'trulii.ui-components',
            'trulii.organizers',
            'trulii.students',
            'trulii.activities',
            'trulii.locations',
            'trulii.landing',
            'trulii.search',
            'trulii.utils',
            'trulii.payments'
        ]);

    angular
        .module('trulii.config', ['facebook', 'ui.utils.masks']);

    angular
        .module('trulii.routes', ['ui.router', 'trulii.routes.config']);

    angular
        .module('trulii')
        .run(run);

    run.$inject = ['$http'];

    /**
     * @ngdoc function
     * @name trulii.run
     * @description Update xsrf $http headers to align with Django's defaults
     * @requires ng.$http
     */
    function run($http) {
        $http.defaults.xsrfHeaderName = 'X-CSRFToken';
        $http.defaults.xsrfCookieName = 'csrftoken';
    }

})();



