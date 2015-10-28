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

    RegisterController.$inject = ['$q', 'Authentication', '$state', '$stateParams', 'validatedData', 'Elevator','Error'];

    function RegisterController($q, Authentication, $state, $stateParams, validatedData, Elevator,Error) {

        var vm = this;
        var selectedMethod = null;
        var toState = null;

        angular.extend(vm, {
            auth : {},
            errors : {},
            user_type : 'S',
            facebook : {
                'error': false
            },
            fbRegister : fbRegister,
            register : register,
            isSelectedMethod : isSelectedMethod,
            setSelectedMethod : setSelectedMethod,
            focusForm : focusForm
        });

        _activate();

        //--------- Functions Implementation ---------//

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

        function fbRegister(){
            Authentication.facebookLogin()
                .then(_registerSuccess, error);

            function error(){
                alert("Couldn't Register with Facebook");
                vm.facebook.error = true;
            }
        }

        function register() {
            vm.signup_form.$setPristine();
            Error.form.clear(vm.signup_form);
            vm.auth.user_type = vm.user_type;

            return Authentication.register(vm.auth)
                .then(_registerSuccess, error);


            function error(response) {

                var responseErrors = response.data['form_errors'];
                if (responseErrors) {
                    Error.form.add(vm.signup_form, responseErrors);
                }
                // _errored(response.data);
                return $q.reject(response);
            }

        }

        function _registerSuccess(){
            $state.go(toState.state, toState.params);
        }

        function _setStrings(){
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

        function _activate(){
            toState = $stateParams.toState;
            // if(!toState){
            //     toState = {
            //         state : 'home',
            //         params: {}
            //     };
            // }

            console.log(toState);
            _setStrings();
            if (validatedData) {
                vm.auth.email = validatedData.email;
                vm.auth.name = validatedData.name;
            }
        }
    }

})();