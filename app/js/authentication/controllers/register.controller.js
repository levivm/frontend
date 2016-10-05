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

    RegisterController.$inject = ['$q', '$scope', 'Authentication', '$state', '$stateParams', 'validatedData', 'Elevator', 'Error', 'Referrals', 'Analytics', 'Toast'];

    function RegisterController($q, $scope, Authentication, $state, $stateParams, validatedData, Elevator, Error, Referrals, Analytics, Toast) {

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
            toLoginState: toLoginState,
            acceptTerms:false
        });

        _activate();

        //--------- Exposed Functions ---------//

        function isSelectedMethod(method){ return selectedMethod === method; }

        function setSelectedMethod(method){ selectedMethod = method; }

        function fbRegister(){
            if(vm.acceptTerms){
                Authentication.facebookLogin()
                    .then(_registerSuccess, error);
            }else{
                Toast.error(vm.strings.ERROR_ACCEPT_TERMS);
            }

            function error(){
                alert("Couldn't Register with Facebook");
                vm.facebook.error = true;
            }
        }

        function register() {
            emailRegister = true;
            if(vm.acceptTerms){
                vm.signup_form.$setPristine();
                Error.form.clear(vm.signup_form);
                vm.auth.user_type = vm.user_type;

                return Authentication.register(vm.auth).then(_registerSuccess, error);

            }else{
                Toast.error(vm.strings.ERROR_ACCEPT_TERMS);
            }

            function error(response) {
                var responseErrors = response.data;
                if (responseErrors){ Error.form.add(vm.signup_form, responseErrors); }
                vm.errors.__all__ = response.data['non_field_errors'];

                return $q.reject(response);
            }
        }

        function registerOrganizer(){
            emailRegister = true;
            if(vm.acceptTerms){
                vm.signup_form.$setPristine();
                Error.form.clear(vm.signup_form);
                vm.auth.user_type = vm.user_type;

                return Authentication.registerOrganizer(vm.auth, $stateParams.token).then(_registerSuccess, error);

            }else{
                Toast.error(vm.strings.ERROR_ACCEPT_TERMS);
            }

            function error(response) {
                var responseErrors = response.data;
                if (responseErrors){ Error.form.add(vm.signup_form, responseErrors); }
                vm.errors.__all__ = response.data['non_field_errors'];

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
                SIGNUP_LABEL : "Registrarme",
                SIGNUP_CONFIRMATION_LABEL: "Confirmación de registro",
                SIGNUP_CONFIRMATION_COPY_1: "!Ya estás aprobado como organizador!",
                SIGNUP_CONFIRMATION_COPY_2: "Sólo falta que coloques una contraseña para a empezar a disfrutar de tu cuenta.",
                SIGNUP_SUBMIT: "Enviar",
                SIGNUP_ALTERNATIVES_LABEL : "Regístrate como asistente con",
                SIGNUP_EMAIL_LABEL: "o con tu correo electrónico",
                LOGIN_LABEL : "Iniciar Sesión",
                EMAIL_LABEL : "Correo electrónico",
                PASSWORD_LABEL : "Contraseña",
                FIRST_NAME_LABEL : "Nombre",
                LAST_NAME_LABEL : "Apellido",
                REGISTER_WITH_FACEBOOK_MSG : "Facebook",
                FACEBOOK_ERROR : "No se pudo iniciar sesión con Facebook",
                ALREADY_HAVE_AN_ACCOUNT_COPY: "¿Ya tienes cuenta en Trulii?",
                TERMS_AND_CONDITIONS_COPY_1: "Registrándome estoy aceptando la",
                LABEL_TERMS: "Términos y Condiciones",
                TERMS_AND_CONDITIONS_COPY_3: "y los",
                LABEL_PRIVACY: "Política de Privacidad",
                TERMS_AND_CONDITIONS_COPY_5: "de Trulii.",
                REGISTER_ORGANIZER_LABEL: "¿Quieres registrarte como organizador?",
                ERROR_ACCEPT_TERMS: "Tienes que aceptar la política de privacidad y los términos y condiciones."
            });
        }

        function _activate(){
            _setStrings();
            toState = $stateParams.toState;

            if (validatedData) {
                vm.auth.email = validatedData.email;
                vm.auth.name = validatedData.name;
            }

            //Function for angularSeo
            $scope.htmlReady();
        }
    }
})();
