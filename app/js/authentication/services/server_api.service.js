/**
 * @ngdoc service
 * @name trulii.authentication.services.AuthenticationServerApi
 * @description API Service for Authentication related Endpoints
 * @requires trulii.routes.serverConf
 */

(function () {
    'use strict';

    angular
        .module('trulii.authentication.services')
        .factory('AuthenticationServerApi', AuthenticationServerApi);

    AuthenticationServerApi.$inject = ['serverConf'];

    function AuthenticationServerApi(serverConf) {

        var server = serverConf.url + '/';
        var serverApi = serverConf.url + '/api/';
//        var apiVersion = 'v1';
        var debug = false;

        //noinspection UnnecessaryLocalVariableJS
        var api = {
          
            /* API - Endpoints that require /api/ */
            
            /**
             * @ngdoc function
             * @name trulii.authentication.services.AuthenticationServerApi#login
             * @description Renders **`/api/auth/login/`** User Login URL
             * @return {string} Rendered URL
             * @methodOf trulii.authentication.services.AuthenticationServerApi
             */
            'login': function(){
                return renderUrl('auth/', ['login/'], true);
            },
            
            /**
             * @ngdoc function
             * @name trulii.authentication.services.AuthenticationServerApi#signup
             * @description Renders **`/api/auth/signup`** User SignUp URL
             * @return {string} Rendered URL
             * @methodOf trulii.authentication.services.AuthenticationServerApi
             */
            'signup': function(){
                return renderUrl('auth/', ['signup'], true);
            },
            /**
             * @ngdoc function
             * @name trulii.authentication.services.AuthenticationServerApi#requestSignup
             * @description Renders **`/api/users/request/signup`** User RequestSignup URL
             * @return {string} Rendered URL
             * @methodOf trulii.authentication.services.AuthenticationServerApi
             */
            'requestSignup': function(){
                return renderUrl('auth/', ['request','signup/'], true);
            },
            /**
             * @ngdoc function
             * @name trulii.authentication.services.AuthenticationServerApi#requestSignupTokenValidation
             * @description Renders **`/users/request/signup/token/`** User RequestSignup URL
             * @return {string} Rendered URL
             * @methodOf trulii.authentication.services.AuthenticationServerApi
             */
            'requestSignupToken': function(token){
                return renderUrl('auth/', ['request','signup','token',token + '/'], true);
            },
            /**
             * @ngdoc function
             * @name trulii.authentication.services.AuthenticationServerApi#organizerSignup
             * @description Renders **`/api/auth/signup`** User organizerSignup URL
             * @return {string} Rendered URL
             * @methodOf trulii.authentication.services.AuthenticationServerApi
             */
            'organizerSignup': function(token){
               return renderUrl('auth/', ['signup',token + '/'], true);
            },
            /**
             * @ngdoc function
             * @name trulii.authentication.services.AuthenticationServerApi#passwordReset
             * @description Renders **`/auth/password/reset/`** User Password Reset URL
             * @param {string=} key (Optional) Password Reset Key
             * @return {string} Rendered URL
             * @methodOf trulii.authentication.services.AuthenticationServerApi
             */
            'passwordReset': function(key){
                return renderUrl('auth/', ['password', 'reset'], true);
            },
            
            /**
             * @ngdoc function
             * @name trulii.authentication.services.AuthenticationServerApi#passwordForgot
             * @description Renders **`/api/auth/password/forgot/`** User Password Forgot URL
             * @return {string} Rendered URL
             * @methodOf trulii.authentication.services.AuthenticationServerApi
             */
            'passwordForgot': function(){
                return renderUrl('auth/', ['password', 'forgot'], true);
            },

            /**
             * @ngdoc function
             * @name trulii.authentication.services.AuthenticationServerApi#passwordChange
             * @description Renders **`/api/auth/password/change/`** User Password Change URL
             * @return {string} Rendered URL
             * @methodOf trulii.authentication.services.AuthenticationServerApi
             */
            'passwordChange': function(){
                return renderUrl('auth/', ['password', 'change/'], true);
            },

            /**
             * @ngdoc function
             * @name trulii.authentication.services.AuthenticationServerApi#email
             * @description Renders **`/api/auth/email/`** User Email URL
             * @return {string} Rendered URL
             * @methodOf trulii.authentication.services.AuthenticationServerApi
             */
            'email': function(){
                return renderUrl('auth/', ['email', 'change/'], true);
            },
            /**
             * @ngdoc function
             * @name trulii.authentication.services.AuthenticationServerApi#confirmEmail
             * @description Renders **`/api/auth/confirm-email/:token/`** User Email URL
             * @return {string} Rendered URL
             * @methodOf trulii.authentication.services.AuthenticationServerApi
             */
            'confirmEmail': function(key){
                return renderUrl('auth/', ['email', 'confirm/'], true);
            },

            /**
             * @ngdoc function
             * @name trulii.authentication.services.AuthenticationServerApi#current
             * @description Renders **`/api/users/current/`** Current User URL
             * @return {string} Rendered URL
             * @methodOf trulii.authentication.services.AuthenticationServerApi
             */
            'current': function(){
                return renderUrl('users/', ['current/'], true);
            },

            /**
             * @ngdoc function
             * @name trulii.authentication.services.AuthenticationServerApi#facebook
             * @description Renders **`/users/facebook/signup/`** Facebook User SignUp URL
             * @return {string} Rendered URL
             * @methodOf trulii.authentication.services.AuthenticationServerApi
             */
            'facebook': function(){
                return renderUrl('auth/', ['login', 'facebook'] , true);
            }

        };

        /**
         * @ngdoc function
         * @name trulii.authentication.services.AuthenticationServerApi#renderUrl
         * @description URL Renderer, takes multiple parameters
         * @param {string} endpoint Server endpoint, must end with '/'
         * @param {Array=} urlParams (Optional) Array with URL params. Are rendered in the same order they come
         * rendered through console output.
         * @param {boolean} api (Optional) Specifies if **`/api/`** is to be added
         * @return {string} Rendered URL
         * @methodOf trulii.authentication.services.AuthenticationServerApi
         */
        function renderUrl(endpoint, urlParams, api){
            var hostArr = null;
            if(api){
                hostArr = [serverApi, endpoint];
            } else {
                hostArr = [server, endpoint];
            }

            var result = urlParams? hostArr.concat(urlParams.join('/')) : hostArr;
            result = result.join('');
            if(debug){
                console.log('ServerApi.renderUrl:');
                console.log(result);
            }
            return result;
        }

        return api;
    }

})();
