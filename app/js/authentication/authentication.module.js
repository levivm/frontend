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
                url:'/register',
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
                    validatedData: tokenSignupValidation
                }
            })
            .state('register-organizer', {
                url:'/organizers/register/:token/',
                controller: 'RegisterController',
                controllerAs: 'vm',
                resolve: {
                    validatedData :  tokenSignupValidation
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
                }
            })
            .state('logout',{
                url:'/logout',
                controller: 'LogOutController'
            })
            .state('password-forgot', {
                url:'/password/forgot',
                controller: 'ForgotPasswordCtrl',
                controllerAs: 'vm',
                templateUrl: 'partials/authentication/forgot_password.html'
            })
            .state("password-reset", {
                url:'/password/reset/key/:reset_key',
                controller: 'ResetPasswordCtrl',
                controllerAs: 'vm',
                templateUrl: 'partials/authentication/reset_password.html'
            })
            .state('email-confirm', {
                url:'/email/confirm/:key/',
                controller: 'EmailConfirmCtrl',
                controllerAs: 'vm',
                templateUrl: 'modalContainer'
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

    }

})();
