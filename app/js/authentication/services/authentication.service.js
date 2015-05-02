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

    Authentication.$inject = [ '$http', '$q', '$state', 'AuthenticationServerApi', 'localStorageService','Facebook'];

    function Authentication($http, $q, $state, AuthenticationServerApi, localStorageService,Facebook) {

        var api = AuthenticationServerApi;

        //noinspection UnnecessaryLocalVariableJS
        var Authentication = {
            register: register,
            requestSignup: request_signup,
            requestSignupToken: token_signup_validation,
            getAuthenticatedAccount: getAuthenticatedAccount,
            isAuthenticated: isAuthenticated,
            login: login,
            facebookLogin:facebookLogin,
            logout:logout,
            confirmEmail:confirm_email,
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


        function register(register_data) {

            // serverConf.url+'/users/signup/'
            console.log("register_data",register_data)
            return $http({
                method: 'post',
                url: api.signup(),
                data:_parseParam(register_data),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            })
            .then(function(register_response){
                console.log(register_data)

                var token_data = {'email':register_data.email,'password':register_data.password1};
                return getToken(token_data)
                    .then(function(response_token){
                        console.log("RESPONSE TOKENN",response_token);
                        setAuthenticationToken(response_token.data.token);
                        setAuthenticatedAccount(response_token.data.user);
                        return register_response
                    })

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

        function facebookLogin(){

            var deferred = $q.defer();

            return deferred.promise
                .then(Facebook.login(function(response) {

                    console.log("FACEBOOOK RESPONSE",response);
                    if (response.status === 'connected') {
                        // Logged into your app and Facebook.
                        var access_token = response.authResponse.accessToken;
                            return $http.post('http://localhost:8000/users/facebook/signup/',
                                                {'auth_token':access_token})
                                    .then(_successFbLogin)

                            function _successFbLogin(response){

                                setAuthenticatedAccount(response.data.user);
                                setAuthenticationToken(response.data.token);
                                deferred.resolve(response);

                            }

                            function _errorFbLogin(response){

                                deferred.reject(response);
                            }                    


                    } else if (response.status === 'not_authorized') {
                        deferred.reject();
                    // The person is logged into Facebook, but not your app.
                    } else {
                        deferred.resolve();
                        
                    // The person is not logged into Facebook, so we're not sure if
                    // they are logged into this app or not.
                    }
                    // Do something with response.
                })
            );



        }

        function logout() {

            // serverConf.url+'/api/users/logout/'
            return $http.post(api.logout())
                .then(unauthenticate, logoutError);
        }

        function request_signup(data){


            return $http.post(api.requestSignup(),data);
                
            


        }

        function confirm_email(key){

            return $http.post(api.confirmEmail(key));

        }

        function token_signup_validation(token){

            return $http.get(api.requestSignupToken(token))
                        .then(function(response){
                            return response.data
                        })
            // .then(

            //     function (res){console.log(res)},function(res){console.log(res)}

            //     );


            // var successValidation = function (response) {
            //     return response.data
            // }          

            // var successValidation
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
            console.log("key111",key);
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

        function setAuthenticationToken(token){
            localStorageService.set('token',token);

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