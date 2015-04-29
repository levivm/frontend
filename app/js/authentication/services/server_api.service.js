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
        var debug = true;

        //noinspection UnnecessaryLocalVariableJS
        var api = {

            /**
             * @ngdoc function
             * @name trulii.authentication.services.AuthenticationServerApi#signup
             * @description Renders **`/users/signup`** User SignUp URL
             * @return {string} Rendered URL
             * @methodOf trulii.authentication.services.AuthenticationServerApi
             */
            'signup': function(){
                return renderUrl('users/', ['signup/'], false);
            },
            /**
             * @ngdoc function
             * @name trulii.authentication.services.AuthenticationServerApi#requestSignup
             * @description Renders **`/users/request/signup`** User RequestSignup URL
             * @return {string} Rendered URL
             * @methodOf trulii.authentication.services.AuthenticationServerApi
             */
            'requestSignup': function(){
                return renderUrl('users/', ['request','signup/'], true);
            },
            /**
             * @ngdoc function
             * @name trulii.authentication.services.AuthenticationServerApi#requestSignupTokenValidation
             * @description Renders **`/users/request/signup/token/`** User RequestSignup URL
             * @return {string} Rendered URL
             * @methodOf trulii.authentication.services.AuthenticationServerApi
             */
            'requestSignupToken': function(token){
                return renderUrl('users/', ['request','signup','token',token + '/'], true);
            },

            /**
             * @ngdoc function
             * @name trulii.authentication.services.AuthenticationServerApi#login
             * @description Renders **`/users/login/`** User Login URL
             * @return {string} Rendered URL
             * @methodOf trulii.authentication.services.AuthenticationServerApi
             */
            'login': function(){
                return renderUrl('users/', ['login/'], false);
            },

            /**
             * @ngdoc function
             * @name trulii.authentication.services.AuthenticationServerApi#token
             * @description Renders **`/api/users/token/`** User Token URL
             * @return {string} Rendered URL
             * @methodOf trulii.authentication.services.AuthenticationServerApi
             */
            'token': function(){
                return renderUrl('users/', ['token/'], true);
            },

            /**
             * @ngdoc function
             * @name trulii.authentication.services.AuthenticationServerApi#passwordReset
             * @description Renders **`/users/password/reset/`** User Password Reset URL
             * @param {string=} key (Optional) Password Reset Key
             * @return {string} Rendered URL
             * @methodOf trulii.authentication.services.AuthenticationServerApi
             */
            'passwordReset': function(key){
                var arr = null;
                console.log("KEY",key);
                if(key){
                    arr = ['password', 'reset','key', key + '/'];
                } else {
                    arr = ['password', 'reset/'];
                }

                return renderUrl('users/', arr, false);
            },

            /**
             * @ngdoc function
             * @name trulii.authentication.services.AuthenticationServerApi#passwordChange
             * @description Renders **`/users/password/change/`** User Password Change URL
             * @return {string} Rendered URL
             * @methodOf trulii.authentication.services.AuthenticationServerApi
             */
            'passwordChange': function(){
                return renderUrl('users/', ['password', 'change/'], false);
            },

            /**
             * @ngdoc function
             * @name trulii.authentication.services.AuthenticationServerApi#email
             * @description Renders **`/users/email/`** User Email URL
             * @return {string} Rendered URL
             * @methodOf trulii.authentication.services.AuthenticationServerApi
             */
            'email': function(){
                return renderUrl('users/', ['email/'], false);
            },
            /**
             * @ngdoc function
             * @name trulii.authentication.services.AuthenticationServerApi#confirmEmail
             * @description Renders **`/users/confirm-email/:token/`** User Email URL
             * @return {string} Rendered URL
             * @methodOf trulii.authentication.services.AuthenticationServerApi
             */
            'confirmEmail': function(key){
                return renderUrl('users/', ['confirm-email',key+'/'], false);
            },

            /* API - Endpoints that require /api/ */

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
             * @name trulii.authentication.services.AuthenticationServerApi#logout
             * @description Renders **`/api/users/logout/`** User API Logout URL
             * @return {string} Rendered URL
             * @methodOf trulii.authentication.services.AuthenticationServerApi
             */
            'logout': function(){
                return renderUrl('users/', ['logout/'], true);
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