(function () {
    'use strict';

    angular
        .module('trulii.authentication', [
            'trulii.authentication.controllers',
            'trulii.authentication.services',
            'trulii.authentication.directives'
        ])
        .config(config);

    angular
        .module('trulii.authentication.controllers', []);

    angular
        .module('trulii.authentication.services', []);

    angular
        .module('trulii.authentication.directives', []);

    //noinspection JSValidateJSDoc
    /**
     * @ngdoc object
     * @name trulii.authentication.config
     * @description Authentication Module Config function
     * @requires ui.router.state.$stateProvider
     */
    config.$inject = ['$stateProvider'];
    function config($stateProvider) {
        $stateProvider
            .state('register', {
                url:'/registrarme',
                controller: 'RegisterController',
                controllerAs: 'vm',
                templateUrl: 'partials/authentication/register.html',
                params: {
                    'toState': {
                        'state': 'home',
                        'params': {}
                    }
                },
                resolve:{
                    isAuthenticated: isAuthenticated,
                    validatedData: tokenSignupValidation
                }
            })
            .state('register-organizer', {
                url:'/organizadores/registrarme/:token/',
                controller: 'RegisterController',
                controllerAs: 'vm',
                resolve: {
                    validatedData :  tokenSignupValidation
                },
               params: {
                    'toState': {
                        'state': 'home',
                        'params': {}
                    }
                },
                templateUrl: 'partials/authentication/register_organizer.html'
            })
            .state('login', {
                url:'/login',
                controller: 'LoginController',
                controllerAs: 'vm',
                templateUrl: 'partials/authentication/login.html',
                params: {
                    'toState' : {
                        'state' : 'home',
                        'params' : {}
                    }
                },
                resolve: {
                    isAuthenticated: isAuthenticated
                }
            })
            .state('logout',{
                url:'/logout',
                controller: 'LogOutController'
            })
            .state('password-forgot', {
                url:'/password/recordar',
                controller: 'ForgotPasswordCtrl',
                controllerAs: 'vm',
                templateUrl: 'partials/authentication/forgot_password.html'
            })
            .state("password-reset", {
                url:'/password/restablecer/key/:reset_key',
                controller: 'ResetPasswordCtrl',
                controllerAs: 'vm',
                templateUrl: 'partials/authentication/reset_password.html'
            })
            .state('email-confirm', {
                url:'/email/confirmar/:key',
                controller: 'EmailConfirmCtrl',
                controllerAs: 'vm',
            });

        /**
         * @ngdoc method
         * @name .#tokenSignupValidation
         * @description Token Sign Up Validation function. Checks if the presented token is not invalid or stale
         * @requires ui.router.state.$stateParams
         * @requires trulii.authentication.services.Authentication
         * @methodOf trulii.authentication.config
         */
        tokenSignupValidation.$inject = ['$stateParams','Authentication'];
        function tokenSignupValidation($stateParams,Authentication){
            return $stateParams.token? Authentication.requestSignupToken($stateParams.token) : {};
        }

        isAuthenticated.$inject = ['$q', 'Authentication'];
        function isAuthenticated($q, Authentication){
            var deferred = $q.defer();
            var isAuthenticated = Authentication.isAuthenticated();
            if(isAuthenticated){
                deferred.reject({ isAuthenticated: isAuthenticated });
            }
            deferred.resolve({ isAuthenticated: isAuthenticated });

            return deferred.promise;
        }

    }

})();
