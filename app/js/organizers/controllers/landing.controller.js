/**
 * @ngdoc controller
 * @name trulii.organizers.controllers.OrganizerLandingCtrl
 * @description Handles Organizers Registration requests
 * @requires ui.router.state.$state
 * @requires trulii.locations.services.LocationManager
 * @requires trulii.authentication.services.Authentication
 * @requires cities
 */

(function () {
    'use strict';

    angular
        .module('trulii.organizers.controllers')
        .controller('OrganizerLandingCtrl', OrganizerLandingCtrl);

    OrganizerLandingCtrl.$inject = ['$state', 'LocationManager', 'Authentication','Error', 'cities'];

    function OrganizerLandingCtrl($state, LocationManager, Authentication, Error,cities) {

        var vm = this;

        /**
         * @name requestSignup
         * @desc Anonymous user request a organizer signup
         * @memberOf trulii.organizers.controllers.OrganizerLandingCtrl
         */
        vm.request_signup = requestSignup;

        vm.cities = cities;
        vm.errors = {};
        vm.request = {};

        initialize();


        function requestSignup() {
            Error.form.clear(vm.pre_signup_form);
            vm.request.city = vm.request.current_city.id;
            Authentication.requestSignup(vm.request).then(success, error);


            function success() {
                $state.go('general-message', {
                    'module_name' : 'authentication',
                    'template_name' : 'request_signup_success',
                    'redirect_state' : 'home'
                });
            }

            function error(response){
                console.log("response.dsad",response);
                var responseErrors = response.data;
                if (responseErrors) {
                    Error.form.add(vm.pre_signup_form, responseErrors);
                }


            }

        }

        function activate() {
            console.log("activating");
            vm.request.current_city = LocationManager.getCurrentCity();
            console.log("city",vm.request.current_city);

        }



        function setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }

            angular.extend(vm.strings, {
                PLACEHOLDER_NAME : 'Nombre de Compañía',
                PLACEHOLDER_TELEPHONE : 'Teléfono',
                PLACEHOLDER_WANT_TO_TEACH : '¿Qué deseas enseñar?',
                CITY_LABEL: 'Ciudad',
                CITY_DEFAULT_LABEL: 'Seleccione Ciudad..',
                REQUEST_SIGNUP_LABEL : 'Solicitar Registro',
                EMAIL_LABEL : "Correo electrónico",
                LOGIN_LABEL : "Inicia Sesión"
            });
        }

        function initialize(){
            setStrings();
            activate();
        }

    }
})();