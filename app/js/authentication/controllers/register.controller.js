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

    RegisterController.$inject = ['$q', 'Authentication', '$state', 'validatedData', 'Elevator'];

    function RegisterController($q, Authentication, $state, validatedData, Elevator) {

        var vm = this;
        var selectedMethod = null;

        vm.auth = {};
        vm.errors = {};
        vm.user_type = 'S';
        vm.facebook = {
            'error': false
        };

        vm.fbRegister = fbRegister;
        vm.register = register;
        vm.isSelectedMethod = isSelectedMethod;
        vm.setSelectedMethod = setSelectedMethod;
        vm.focusForm = focusForm;

        initialize();

        function isSelectedMethod(method){
            return selectedMethod === method;
        }

        function setSelectedMethod(method){
            selectedMethod = method;
        }

        function focusForm(){
            
            // this must be to use toElement but is not working :(
            Elevator.toBottom(3000);

        }

        function _clearErrors() {
            vm.errors = null;
            vm.errors = {};
        }

        function fbRegister(){
            Authentication.facebookLogin()
                .then(success, error);

            function success(){
                // $state.go('home');
                $state.go("brow.home")
            }
            function error(){
                alert("Couldn't Register with Facebook");
                vm.facebook.error = true;
            }
        }

        function register() {
            _clearErrors();
            vm.auth.user_type = vm.user_type;

            return Authentication.register(vm.auth)
                .then(function (response) {
                    // $state.go("home");
                    $state.go("brow.home");
                    
                    //TODO HERE SHOULD SHOW A POP UP
                }, _registerError);

            function _registerError(response) {
                _errored(response.data);
                return $q.reject(response);
            }

            function _errored(data) {
                if (data['form_errors']) {
                    angular.forEach(data['form_errors'], function (errors, field) {
                        _addError(field, errors[0]);
                    });
                }
            }

            function _addError(field, message) {
                vm.errors[field] = message;
                vm.signup_form[field].$setValidity(message, false);
            }

        }

        function setStrings(){
            if(!vm.strings){ vm.strings = {}; }
            angular.extend(vm.strings, {
                SIGNUP_LABEL : "Registrarme",
                SIGNUP_ALTERNATIVES_LABEL : "O puedes registrarte con",
                LOGIN_LABEL : "Iniciar Sesión",
                EMAIL_LABEL : "Correo electrónico",
                PASSWORD_LABEL : "Contraseña",
                FIRST_NAME_LABEL : "Nombre",
                LAST_NAME_LABEL : "Apellido",
                REGISTER_WITH_FACEBOOK_MSG : "Regístrate con Facebook",
                FACEBOOK_ERROR : "No se pudo iniciar sesión con Facebook"
            });
        }

        function initialize(){
            setStrings();
            if (validatedData) {
                vm.auth.email = validatedData.email;
                vm.auth.name = validatedData.name;
            }
        }
    }

})();