/**
 * @ngdoc controller
 * @name trulii.authentication.controllers.LoginController
 * @description Handles user Login, both Student and Organizer
 * @requires ui.router.state.$state
 * @requires ng.$q
 * @requires trulii.authentication.services.Authentication
 */

(function () {
    'use strict';

    angular
        .module('trulii.authentication.controllers')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$state','$q','Authentication'];

    function LoginController($state, $q, Authentication) {
        var vm = this;
        vm.errors = {};
        vm.auth = {};
        vm.is_new = true;

        vm.login = _login;
        vm.facebookLogin = _facebookLogin;
        vm.clearErrors = clearErrors;

        initialize();

        //--------- Functions Implementation ---------//

        function clearErrors(){
            vm.errors = null;
            vm.errors = {};
        }

        function _addError(field, message) {
            vm.errors[field] = message;
            vm.login_form[field].$setValidity(message, false);
        }

        function _errored(data) {
            if (data['form_errors']) {
                angular.forEach(data['form_errors'], function(errors, field) {
                    _addError(field, errors[0]);
                });
            }
        }

        function _login() {
            clearErrors();
            console.log("vm auth",vm.auth);
            return  Authentication.login(vm.auth.email, vm.auth.password)
                .then(_loginSuccess,_loginError);
        }

        function _facebookLogin() {
            return  Authentication.facebookLogin()
                        .then(successFbLogin,errorFbLogin);

            function successFbLogin(response){
                $state.go("brow.home")
            }
            function errorFbLogin(response){
                $state.go('general-message', {
                    'module_name':'authentication',
                    'template_name':'social_login_cancelled',
                   'redirect_state':'home'
                });
            }
        }

        function _loginSuccess(redirect_state) {
            console.log("redirect state", redirect_state);
            $state.go(redirect_state.data.location);
            Authentication.updateAuthenticatedAccount();
        }

        function _loginError(response) {
            _errored(response.data);
            return $q.reject(response);
        }

        function setStrings(){
            if(!vm.strings){ vm.strings = {}; }
            angular.extend(vm.strings, {
                LOGIN_LABEL : "Iniciar Sesión",
                LOGIN_ALTERNATIVES_LABEL : "O puedes iniciar sesión con",
                EMAIL_LABEL : "Correo electrónico",
                PASSWORD_LABEL : "Contraseña",
                FIRST_NAME_LABEL : "Nombre",
                LAST_NAME_LABEL : "Apellido",
                LOGIN_WITH_FACEBOOK_MSG : "Iniciar sesion con Facebook",
                FACEBOOK_ERROR : "No se pudo iniciar sesión con Facebook"
            });
        }

        function initialize(){
            setStrings();
        }
    }
})();