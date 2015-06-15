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

    LoginController.$inject = ['$state','$stateParams', '$q','Authentication','Error'];

    function LoginController($state, $stateParams, $q, Authentication,Error) {
        var vm = this;
        var fromState = null;
        vm.errors = {};
        vm.auth = {};
        vm.is_new = true;

        vm.login = login;
        vm.facebookLogin = _facebookLogin;

        initialize();

        //--------- Functions Implementation ---------//


        function login() {
            Error.form.clear(vm.login_form);
            console.log("vm auth",vm.auth);
            return  Authentication.login(vm.auth.email, vm.auth.password)
                .then(_loginSuccess,error);


            function error(response) {
                
                var responseErrors = response.data['form_errors'];
                if (responseErrors) {
                    Error.form.add(vm.login_form, responseErrors);
                }

                return $q.reject(response);
            }

        }

        function _facebookLogin() {
            return  Authentication.facebookLogin()
                        .then(_loginSuccess ,errorFbLogin);

            function errorFbLogin(response){
                $state.go('general-message', {
                    'module_name':'authentication',
                    'template_name':'social_login_cancelled',
                   'redirect_state':'home'
                });
            }
        }

        function _loginSuccess(redirect_state) {
            Authentication.updateAuthenticatedAccount().then(success, _loginError);

            function success(){
                if(!!fromState.state){
                    $state.go(fromState.state, fromState.params);
                } else {
                    $state.go("home");
                }
            }
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
                LOGIN_WITH_FACEBOOK_MSG : "Iniciar sesión con Facebook",
                FACEBOOK_ERROR : "No se pudo iniciar sesión con Facebook"
            });
        }

        function initialize(){
            fromState = $stateParams.from;
            setStrings();
        }
    }
})();