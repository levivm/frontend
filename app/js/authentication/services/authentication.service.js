/**
 * @ngdoc service
 * @name trulii.authentication.services.Authentication
 * @description Authentication Service
 * @requires ng.$http
 * @requires ng.$q
 * @requires ui.router.state.$state
 * @requires trulii.authentication.services.AuthenticationServerApi
 * @requires LocalStorageModule.localStorageService
 */

(function () {
    'use strict';

    angular
        .module('trulii.authentication.services')
        .factory('Authentication', Authentication);

    Authentication.$inject = [ '$http', '$q', '$state', 'AuthenticationServerApi', 'localStorageService'];

    function Authentication($http, $q, $state, AuthenticationServerApi, localStorageService) {

        var api = AuthenticationServerApi;

        //noinspection UnnecessaryLocalVariableJS
        var Authentication = {
            register: register,
            getAuthenticatedAccount: getAuthenticatedAccount,
            isAuthenticated: isAuthenticated,
            login: login,
            logout:logout,
            reset_password:reset_password,
            forgot_password:forgot_password,
            change_password: change_password,
            change_email: change_email,
            updateAuthenticatedAccount: updateAuthenticatedAccount,
            setAuthenticatedAccount: setAuthenticatedAccount,
            unauthenticate: unauthenticate,
            getCurrentUser:getCurrentUser,
            isAnonymous:isAnonymous
        };

        return Authentication;


        /** Helper function */
        function _parseParam(obj) {
            var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

            for(name in obj) {
                value = obj[name];

                if(value instanceof Array) {
                    for(i=0; i<value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[]';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                }
                else if(value instanceof Object) {
                    for(subName in value) {
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                }
                else if(value !== undefined && value !== null)
                    query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
            }

            return query.length ? query.substr(0, query.length - 1) : query;
        }


        function register(email, password,first_name,last_name,user_type) {

            // serverConf.url+'/users/signup/'
            return $http({
                method: 'post',
                url: api.signup(),
                data:_parseParam({
                    password1: password,
                    email: email,
                    first_name: first_name,
                    last_name: last_name,
                    user_type: user_type
                }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            });

        }

        function login(email, password) {
            // serverConf.url+'/users/login/'
            return $http({
                method: 'post',
                url: api.login(),
                data: _parseParam({
                    login: email,
                    password: password
                }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            })
            .then(function(login_response){
                var login_data = {'email':email,'password':password};
                return getToken(login_data)
                    .then(function(response_token){
                        localStorageService.set('token',response_token.data.token);
                        return login_response;
                    }
                );
            },authenticationError);

        }

        function logout() {

            // serverConf.url+'/api/users/logout/'
            return $http.post(api.logout())
                .then(unauthenticate, logoutError);
        }

        function forgot_password(email) {

            // serverConf.url+'/users/password/reset/'
            return $http({
                url: api.passwordReset(),
                method: 'post',
                data:_parseParam({'email':email}),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            });

        }

        function reset_password(key,password1,password2) {

            // serverConf.url+'/users/password/reset/key/'+key+'/'
            return $http({
                url: api.passwordReset(key),
                data:_parseParam({'password1':password1,'password2':password2}),
                method: 'post',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            });

        }

        function change_password(password_data){

            // serverConf.url+'/users/password/change/'
            return $http({
                method: 'post',
                url: api.passwordChange(),
                data:_parseParam(password_data),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            });

        }


        function change_email(email){

            // serverConf.url+'/users/email/'
            return $http({
                method: 'post',
                url: api.email(),
                data: _parseParam({
                    'email': email,
                    'action_add': true
                }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            });

        }


        function getCurrentUser(){
            // serverConf.url+'/api/users/current/'
            return $http.get(api.current());
        }

        function getToken(login_data){

            // serverConf.url+'/api/users/token/'
            return $http({
                method: 'post',
                url: api.token(),
                data: login_data
            });

        }


        /** AUTH HELPER / CALLBACKS METHODS */

        function logoutError(response){
            redirect();
        }

        function authenticationError(response){

            console.log("response BAD login",response);
            return $q.reject(response);

        }

        function isAnonymous(){
            return getAuthenticatedAccount() ? false:true;
        }

        function getAuthenticatedAccount() {
            if (!isAuthenticated()) {
                return;
            }

            return localStorageService.get('user');
        }

        function isAuthenticated() {
            return !!localStorageService.get('user');
        }

        function setAuthenticatedAccount(data){
            localStorageService.set('user',data);
            return data;
        }

        function updateAuthenticatedAccount() {
            return getCurrentUser().then(function(response){
                localStorageService.set('user',response.data);
                return response;
            });
        }

        function unauthenticate() {
            localStorageService.remove('user');
            localStorageService.remove('token');
        }

        function redirect(){
            $state.go("home");
        }

    }

})();