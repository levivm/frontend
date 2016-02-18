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

    LoginController.$inject = ['$state', '$stateParams', '$q', 'Authentication', 'Error', 'Analytics'];

    function LoginController($state, $stateParams, $q, Authentication, Error, Analytics) {

        var vm = this;
        angular.extend(vm, {
            errors : {},
            auth : {},
            is_new : true,
            login : login,
            facebookLogin : facebookLogin,
            goSignupState:goSignupState
        });

        var toState = null;
        var loginEmail = false;
        var loginFacebook = false;
        _activate();

        //--------- Functions Implementation ---------//

        function login() {
            loginEmail = true;
            Error.form.clear(vm.login_form);
            console.log("vm auth:",vm.auth);
            return  Authentication.login(vm.auth.email, vm.auth.password)
                .then(_loginSuccess,error);

            function error(response) {
                var responseErrors = response.data['form_errors'];
                if (responseErrors) { Error.form.add(vm.login_form, responseErrors); }
                return $q.reject(response);
            }
        }

        function facebookLogin() {
            loginFacebook=true;
            return  Authentication.facebookLogin()
                        .then(_loginSuccess ,error);

            function error(response){
                $state.go('general-message', {
                    'module_name':'authentication',
                    'template_name':'social_login_cancelled',
                    'redirect_state':toState.state,
                    'redirect_params':toState.params
                });
            }
        }

        function goSignupState(){

            $state.go('register', toState);

        }

        function _loginSuccess(redirect_state) {

            //Send Analytics data
            Analytics.generalEvents.loginType(loginEmail, redirect_state.data.user.user_type);
            //End Send Analytics data
            $state.go(toState.state, toState.params);
        }

        function _setStrings(){
            if(!vm.strings){ vm.strings = {}; }
            angular.extend(vm.strings, {
                LOGIN_LABEL : "Iniciar Sesión",
                LOGIN_ALTERNATIVES_LABEL : "Conéctate con",
                FORGOT_PASSWORD: "Olvidé mi contraseña",
                EMAIL_LABEL : "Correo electrónico",
                PASSWORD_LABEL : "Contraseña",
                FIRST_NAME_LABEL : "Nombre",
                LAST_NAME_LABEL : "Apellido",
                LOGIN_WITH_FACEBOOK_MSG : "Facebook",
                FACEBOOK_ERROR : "No se pudo iniciar sesión con Facebook",
                NO_ACCOUNT_COPY: "¿No tienes cuenta?",
                REGISTER_COPY: "Registrate"
            });
        }

        function _activate(){

            toState = $stateParams.toState;
            _setStrings();
        }
    }
})();
