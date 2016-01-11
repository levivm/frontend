/**
 * @ngdoc overview
 * @name trulii.routes
 * @description
 * App Routes Module
 */

(function () {
    'use strict';

    angular
        .module('trulii.routes')
        .config(config)
        .run(run);

    //noinspection JSValidateJSDoc
    /**
     * @ngdoc object
     * @name trulii.routes.config
     * @description Routes Module Config function
     * @requires ui.router.state.$stateProvider
     * @requires ui.router.router.$urlRouterProvider
     * @requires ui.router.util.$urlMatcherFactoryProvider
     */
    config.$inject = ['$urlRouterProvider', '$stateProvider', '$urlMatcherFactoryProvider'];
    function config($urlRouterProvider, $stateProvider, $urlMatcherFactoryProvider) {

        $urlMatcherFactoryProvider.strictMode(false);
        $urlRouterProvider.otherwise('/404');

        $stateProvider
            .state('search', {
                url: '/search?q&city&category&subcategory&date&level&cost_start&cost_end&certification&weekends',
                controller:'SearchController as search',
                templateUrl: 'partials/search.html',
                resolve:{
                    'generalInfo':getPresaveActivityInfo
                },
                params: {
                    'activities': []
                }
            })
            .state('home',{
                url:'/',
                controller:'HomeController as home',
                templateUrl: 'partials/landing/landing.html',
                resolve: {
                    // activities: getActivities,
                    activities: function(){return {}},
                    generalInfo: getPresaveActivityInfo
                }
            })
            .state('contact-us', {
                url:'/contact/us',
                controller:'ContactController as contact',
                resolve:{
                    cities:getAvailableCities
                },
                templateUrl: 'partials/landing/contact_us.html',
                params: {
                    'toState' : {
                        'state' : 'home',
                        'params' : {}
                    }
                }
            })
            .state('modal-dialog', {
                url:'/',
                controller: 'DialogModalCtrl',
                controllerAs: 'vm'
            })
            .state('modal-dialog.password-forgot', {
                url:'password/forgot/',
                parent: 'modal-dialog',
                views:{
                    'modal@':{
                        templateUrl: '/partials/authentication/forgot_password.html',
                        controller: 'ForgotPasswordCtrl',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('general-message', {
                url:'/messages/:module_name/:template_name/?redirect_state',
                controller: 'SimpleModalMsgCtrl',
                controllerAs: 'vm'
            })
            .state('not-found', {
                url: '/404',
                controller: 'NotFoundController as notFound',
                templateUrl: 'partials/landing/not_found.html',
                resolve:{
                    cities: getAvailableCities
                },
                params: {
                    message: null,
                    fromState: null,
                    fromParams: null
                }
            });
    }

    //--------- Resolver Functions Implementation ---------//

    /**
     * @ngdoc method
     * @name .#getPresaveActivityInfo
     * @description Loads general activity info like categories, subcategories, levels, etc. from
     * {@link trulii.activities.services.ActivitiesManager ActivitiesManager} Service
     * @requires trulii.activities.services.ActivitiesManager
     * @methodOf trulii.routes.config
     */
    getPresaveActivityInfo.$inject = ['ActivitiesManager'];
    function getPresaveActivityInfo(ActivitiesManager){
        return ActivitiesManager.loadGeneralInfo();
    }

    /**
     * @ngdoc method
     * @name .#getActivities
     * @description Retrieves all activities
     * {@link trulii.activities.services.ActivitiesManager ActivitiesManager} Service
     * @requires trulii.activities.services.ActivitiesManager
     * @methodOf trulii.routes.config
     */
    getActivities.$inject = ['$q', 'ActivitiesManager'];
    function getActivities($q, ActivitiesManager){
        var deferred = $q.defer();

        ActivitiesManager.getActivities().then(success, error);

        return deferred.promise;

        function success(activities){
            deferred.resolve(activities);
        }
        function error(response){
            console.log('getActivities. Error obtaining Activities from ActivitiesManager', response);
            deferred.reject(null);
        }
    }

    /**
     * @ngdoc method
     * @name .#getAvailableCities
     * @description Retrieves all available cities from
     * {@link trulii.locations.services.LocationManager LocationManager} Service
     * @requires trulii.locations.services.LocationManager
     * @methodOf trulii.routes.config
     */
    getAvailableCities.$inject = ['LocationManager'];
    function getAvailableCities(LocationManager){
        return LocationManager.getAvailableCities();
    }

    //--------- Module Run Method ---------//

    /**
     * @ngdoc function
     * @name trulii.routes.run
     * @description Routes Module Run function
     * @requires ng.$rootScope
     * @requires ui.router.state.$state
     * @requires ui.router.util.$urlMatcherFactory
     * @requires trulii.authentication.services.Authentication
     */
    run.$inject = ['$rootScope', '$state', '$urlMatcherFactory', 'Authentication'];
    function run($rootScope, $state, $urlMatcherFactory, Authentication){

        $urlMatcherFactory.strictMode(false);

        $rootScope.$on('$stateChangeStart', onStateChangeStart);
        $rootScope.$on('$stateChangeError', onStateChangeError);

        //--------- Functions Implementation ---------//

        //noinspection JSUnusedLocalSymbols
        function onStateChangeStart(e, toState, toParams, fromState){
            $state.previous = fromState;
            if (toState.data && toState.data.requiredAuthentication) {
                var _requiredAuthentication = toState.data.requiredAuthentication;
                if (_requiredAuthentication && !Authentication.isAuthenticated()) {
                    console.group('stateChange Rejected. Authentication Needed');
                    console.warn('fromState: ', fromState.name);
                    console.warn('toState: ', toState.name);
                    console.groupEnd();
                    e.preventDefault();
                    $state.go('home', {'notify': false});
                }
            }
        }

        //noinspection JSUnusedLocalSymbols
        function onStateChangeError(event, toState, toParams, fromState, fromParams, error){
            $state.previous = fromState;
            console.group('stateChangeError');
            console.info('fromState:', fromState);
            console.info('toState:', toState);
            console.info('event:', event);
            console.info('error:', error);
            console.groupEnd();
            event.preventDefault();

            switch(toState.name){
                case 'referrals.home':
                    $state.go('referrals.home-anon');
                    break;
                case 'referrals.home-anon':
                case 'referrals.invitation':
                    $state.go('referrals.home');
                    break;
                case 'register':
                case 'login':
                    $state.go('home');
                    break;
                default:
                    console.info('Resolve Error. Redirecting to "not-found"');
                    $state.go('not-found', {
                        message: 'State Not Found',
                        fromState: fromState,
                        fromParams: fromParams
                    });
            }
        }

    }

})();
