/**
 * @ngdoc controller
 * @name trulii.authentication.controllers.RegisterController
 * @description Handles Student Registration using different methods like Facebook or regular Email
 * @requires ng.$q
 * @requires trulii.authentication.services.Authentication
 * @requires ui.router.state.$state
 * @requires validatedData
 */

(function () {
    'use strict';

    angular
        .module('trulii.authentication.controllers')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['$q', 'Authentication', '$state', '$stateParams', 'validatedData', 'Elevator', 'Error', 'Referrals', 'Analytics'];

    function RegisterController($q, Authentication, $state, $stateParams, validatedData, Elevator, Error, Referrals, Analytics) {

        var selectedMethod = null;
        var toState = null;
        var emailRegister = false;

        var vm = this;
        angular.extend(vm, {
            auth: {},
            errors: {},
            user_type: 'S',
            facebook: {
                error: false
            },
            fbRegister: fbRegister,
            register: register,
            registerOrganizer: registerOrganizer,
            isSelectedMethod: isSelectedMethod,
            setSelectedMethod: setSelectedMethod,
            focusForm: focusForm,
            toLoginState: toLoginState
        });

        _activate();

        //--------- Exposed Functions ---------//

        function isSelectedMethod(method){ return selectedMethod === method; }

        function setSelectedMethod(method){ selectedMethod = method; }

        function focusForm(){
            // this must be to use toElement but is not working :(
            Elevator.toBottom(3000);
        }

        function fbRegister(){
            Authentication.facebookLogin()
                .then(_registerSuccess, error);

            function error(){
                alert("Couldn't Register with Facebook");
                vm.facebook.error = true;
            }
        }

        function register() {
            emailRegister = true;
            vm.signup_form.$setPristine();
            Error.form.clear(vm.signup_form);
            vm.auth.user_type = vm.user_type;
            console.log(vm.auth.user_type);

            return Authentication.register(vm.auth).then(_registerSuccess, error);

            function error(response) {
                var responseErrors = response.data['form_errors'];
                if (responseErrors){ Error.form.add(vm.signup_form, responseErrors); }

                return $q.reject(response);
            }
        }
        
        function registerOrganizer(){
          console.log('??');
            emailRegister = true;
            vm.signup_form.$setPristine();
            Error.form.clear(vm.signup_form);
            vm.auth.user_type = vm.user_type;
            console.log(vm.auth.user_type);

            return Authentication.registerOrganizer(vm.auth, $stateParams.token).then(_registerSuccess, error);

            function error(response) {
                var responseErrors = response.data['form_errors'];
                if (responseErrors){ Error.form.add(vm.signup_form, responseErrors); }

                return $q.reject(response);
            }
        }

        function toLoginState(){
            $state.go('login', $stateParams);
        }

        //--------- Internal Functions ---------//

        function _registerSuccess(){
            Analytics.generalEvents.registerType(emailRegister, vm.auth.user_type);
            Referrals.deleteRefHash();
            $state.go(toState.state, toState.params);
        }

        function _setStrings(){
            if(!vm.strings){ vm.strings = {}; }
            angular.extend(vm.strings, {
                SIGNUP_LABEL : "Registrate",
                SIGNUP_CONFIRMATION_LABEL: "Confirmar registro",
                SIGNUP_SUBMIT: "Enviar",
                SIGNUP_ALTERNATIVES_LABEL : "Regístrate con",
                SIGNUP_EMAIL_LABEL: "O regístrate con tu correo electrónico",
                LOGIN_LABEL : "Iniciar Sesión",
                EMAIL_LABEL : "Correo electrónico",
                PASSWORD_LABEL : "Contraseña",
                FIRST_NAME_LABEL : "Nombre",
                LAST_NAME_LABEL : "Apellido",
                REGISTER_WITH_FACEBOOK_MSG : "Facebook",
                FACEBOOK_ERROR : "No se pudo iniciar sesión con Facebook",
                ALREADY_HAVE_AN_ACCOUNT_COPY: "¿Ya tienes cuenta en Trulii?",
                TERMS_AND_CONDITIONS_COPY_1: "Registrandome estoy aceptando los",
                LABEL_TERMS: "Términos y Condiciones",
                TERMS_AND_CONDITIONS_COPY_3: "y la",
                LABEL_PRIVACY: "Política de Privacidad",
                TERMS_AND_CONDITIONS_COPY_5: "de Trulii."
            });
        }

        function _activate(){
            _setStrings();
            toState = $stateParams.toState;

            if (validatedData) {
                vm.auth.email = validatedData.email;
                vm.auth.name = validatedData.name;
            }
        }
    }
})();
