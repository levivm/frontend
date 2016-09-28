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
    config.$inject = ['$urlRouterProvider', '$stateProvider', '$urlMatcherFactoryProvider', 'UIRouterMetatagsProvider', 'serverConf'];
    function config($urlRouterProvider, $stateProvider, $urlMatcherFactoryProvider, UIRouterMetatagsProvider, serverConf) {
        var DEFAULT_TITLE='Trulii: Cursos, Clases, Talleres y Actividades en Colombia';
        var DEFAULT_DESCRIPTION = 'Trulii es la primera plataforma educativa en Colombia. Encuentra cursos, actividades o clases de tu interés. ¡Inscríbete o publica GRATIS tu curso aquí!';
        UIRouterMetatagsProvider.setDefaultTitle(DEFAULT_TITLE);
        UIRouterMetatagsProvider.setDefaultDescription(DEFAULT_DESCRIPTION);
        UIRouterMetatagsProvider.setStaticProperties({
                'og:title': DEFAULT_TITLE,
                'og:description': DEFAULT_DESCRIPTION,
                'og:image': serverConf.s3URL + '/' + 'static/img/share_green.jpg',
                'og:locale': 'es_CO'
            })
        UIRouterMetatagsProvider.setOGURL(true);

        $urlMatcherFactoryProvider.strictMode(false);
        $urlRouterProvider.otherwise('/404');

        $stateProvider
            .state('search', {
                url: '/buscar?q&city&category&subcategory&date&level&cost_start&cost_end&certification&weekends&page&is_free&o',
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
                params: {
                  from_menu: null
                },
                resolve: {
                     activities: getRecommendedActivities,
                     generalInfo: getPresaveActivityInfo
                },
                metaTags:{
                    title: DEFAULT_TITLE,
                    description: DEFAULT_DESCRIPTION
                }

            })
            .state('contact-us', {
                url:'/contactanos',
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
                },
                metaTags:{
                    title:'Contáctanos | Trulii',
                    description: '¿Quieres publicar o inscribirte en alguna actividad? ¿Tienes dudas o preguntas? Si necesitas ayuda, no dudes en contactarnos aquí. ¡Ingresa Ya!',
                    properties: {
                        'og:title': 'Contáctanos | Trulii',
                        'og:description': '¿Quieres publicar o inscribirte en alguna actividad? ¿Tienes dudas o preguntas? Si necesitas ayuda, no dudes en contactarnos aquí. ¡Ingresa Ya!',
                        'og:image': serverConf.s3URL + '/' + 'static/img/share_green.jpg'
                    }
                }
            })
            .state('modal-dialog', {
                url:'/',
                controller: 'DialogModalCtrl',
                controllerAs: 'vm'
            })
            .state('modal-dialog.password-forgot', {
                url:'password/recordar/',
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
     * @name .#getRecommendedActivities
     * @description Retrieves all activities
     * {@link trulii.activities.services.ActivitiesManager ActivitiesManager} Service
     * @requires trulii.activities.services.ActivitiesManager
     * @methodOf trulii.routes.config
     */
    getRecommendedActivities.$inject = ['$q', 'ActivitiesManager', 'LocationManager'];
    function getRecommendedActivities($q, ActivitiesManager, LocationManager){
        var deferred = $q.defer();
        LocationManager.init().then(function(currentCity){
            ActivitiesManager.getFeaturedActivities().then(success, error);
        });
        return deferred.promise;

        function success(activities){
            deferred.resolve(activities);
        }
        function error(response){
            console.log('getRecommendedActivities. Error obtaining Activities from ActivitiesManager', response);
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
