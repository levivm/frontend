//noinspection JSValidateJSDoc
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

    Authentication.$inject = [ '$rootScope', '$http', '$q', '$state',
        'AuthenticationServerApi', 'localStorageService', 'Facebook', 'defaultPicture'];

    function Authentication($rootScope, $http, $q, $state, AuthenticationServerApi, localStorageService,
                            Facebook, defaultPicture) {

        var USER_CHANGED_EVENT = 'userChanged';
        var USER_LOGOUT_EVENT = 'userLogout';
        var TOKEN_KEY = 'token';
        var USER_KEY = 'user';
        var api = AuthenticationServerApi;

        //noinspection UnnecessaryLocalVariableJS
        var Authentication = {
            register: register,
            registerOrganizer: registerOrganizer,
            requestSignup: request_signup,
            requestSignupToken: token_signup_validation,
            getAuthenticatedAccount: getAuthenticatedAccount,
            isAuthenticated: isAuthenticated,
            login: login,
            facebookLogin: facebookLogin,
            logout: logout,
            confirmEmail: confirm_email,
            reset_password: reset_password,
            forgot_password: forgot_password,
            change_password: change_password,
            change_email: change_email,
            setAuthenticatedAccount: setAuthenticatedAccount,
            unauthenticate: unauthenticate,
            isStudent: isStudent,
            isOrganizer: isOrganizer,
            emitUserChanged: emitUserChanged,
            USER_CHANGED_EVENT : USER_CHANGED_EVENT,
            USER_LOGOUT_EVENT : USER_LOGOUT_EVENT
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

        function register(register_data) {

            return $http({
                method: 'post',
                url: api.signup(),
                data:_parseParam(register_data),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            })
            .then(success,error);


            function success(response){
                _updateData(response.data.user,response.data.token);
                return response;
            }

            function error(response){
                console.log("response BAD login",response);
                return $q.reject(response);
            }
        }

         function registerOrganizer(register_data, token) {

            return $http({
                method: 'post',
                url: api.organizerSignup(token),
                data:_parseParam(register_data),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            })
            .then(success,error);


            function success(response){

                _updateData(response.data.user,response.data.token);
                return response;
            }

            function error(response){
                console.log("response BAD login",response);
                return $q.reject(response);
            }
        }

        function login(email, password) {
            return $http({
                method: 'post',
                url: api.login(),
                data:
                _parseParam({
                    email: email,
                    password: password
                }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            })
            .then(success, error);

            function success(response){
                _updateData(response.data.user, response.data.token);
                return response;
            }

            function error(response){
                console.log("Invalid Login Credentials. Response:",response);
                return $q.reject(response);
            }
        }

        function facebookLogin(){
            var deferred = $q.defer();
            console.log(Facebook);
            console.log(api.facebook());
            return deferred.promise
                .then(Facebook.login(function(response) {
                    if (response.status === 'connected') {
                        // Logged into your app and Facebook.
                        var access_token = response.authResponse.accessToken;
                        return $http.post(api.facebook(),
                                            { 'access_token': access_token })
                                .then(success);

                    } else if (response.status === 'not_authorized') {
                        // The person is logged into Facebook, but not your app.
                        error(response);
                    } else {
                        // The person is not logged into Facebook, so we're not sure if
                        // they are logged into this app or not.
                        error(response);
                    }
                },{scope: 'email'})
            );

            function success(response){
                setAuthenticatedAccount(response.data.user);
                setAuthenticationToken(response.data.token);
                deferred.resolve(response);
            }

            function error(response){
                deferred.reject(response);
            }
        }

        function logout() {
            unauthenticate();
            redirect();
        }

        function request_signup(data){
            return $http.post(api.requestSignup(),data);
        }

        function confirm_email(key){
            return $http({
              method: 'post',
              url: api.confirmEmail(key),
              data:_parseParam({'token': key}),
              headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            });
        }

        function token_signup_validation(token){
            return $http.get(api.requestSignupToken(token))
                        .then(function(response){
                            return response.data;
                        });
        }

        function forgot_password(email) {
            return $http({
                url: api.passwordForgot(),
                method: 'post',
                data:_parseParam({'email':email}),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            });
        }

        function reset_password(token, password1, password2) {
            return $http({
                url: api.passwordReset(),
                data:_parseParam({'password1':password1,'password2':password2, 'token': token}),
                method: 'post',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            });
        }

        function change_password(password_data){
            return $http({
                method: 'post',
                url: api.passwordChange(),
                data:_parseParam(password_data),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            });
        }

        function change_email(email){
            console.log('Authentication.change_email.email:', email);
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

        /** AUTH HELPER / CALLBACKS METHODS */

        function isStudent(){
            return getAuthenticatedAccount().then(success, error);

            function success(user){
                return (user && user.user_type && user.user_type === 'S');
            }

            function error(){
                return false;
            }
        }

        function isOrganizer(){
            return getAuthenticatedAccount().then(success, error);

            function success(user){
                return (user && user.user_type && user.user_type === 'O');
            }

            function error(){
                return false;
            }
        }

        function setAuthenticatedAccount(data){
            _updateData(data);
            return data;
        }

        function setAuthenticationToken(token){
            _updateData(null, token);
        }

        function isAuthenticated() {
            return !!localStorageService.get(USER_KEY);
        }

        function getAuthenticatedAccount(force_fetch) {
            var deferred = $q.defer();
            if(force_fetch){
                 $http.get(api.current()).then(success, error);
            } else {
                if (!isAuthenticated()) {
                    deferred.resolve(null);
                } else {
                    deferred.resolve(localStorageService.get(USER_KEY));
                }
            }

            return deferred.promise;

            function success(response){
                var user = _mapDisplayName(response.data);
                _updateData(user);
                deferred.resolve(user);
            }

            function error(){
                deferred.reject(null);
            }
        }

        function _mapDisplayName(data) {
            var user = data.user;
            var company = data.name;
            if (company) {
                user.full_name = company;
            } else if (user.full_name) {
                console.log('Full Name already defined');
            } else if (user.first_name && user.last_name) {
                user.full_name = [user.first_name, user.last_name].join(' ');
            } else {
                user.full_name = 'User';
            }

            if (!data.photo) { data.photo = defaultPicture; }

            return data;
        }

        function _updateData(user, token){
            if(user){
                localStorageService.set(USER_KEY, user);
                $rootScope.$emit(USER_CHANGED_EVENT);
            }

            if(token){
                localStorageService.set(TOKEN_KEY, token);
            }
        }

        function unauthenticate() {
            localStorageService.remove(USER_KEY);
            localStorageService.remove(TOKEN_KEY);
            $rootScope.$emit(USER_LOGOUT_EVENT);
        }

        function redirect(){
            $state.go("home");
        }

        function emitUserChanged(){
            console.log('Authentication. emitUserChanged. $emit');
            getAuthenticatedAccount(true).then(callback, callback);

            function callback(){
                $rootScope.$emit(USER_CHANGED_EVENT);
            }
        }

    }

})();
