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

    OrganizerLandingCtrl.$inject = ['$state', 'LocationManager', 'Authentication', 'cities'];

    function OrganizerLandingCtrl($state, LocationManager, Authentication, cities) {

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
            _clearErrors();
            vm.request.city = vm.request.current_city.id;
            Authentication.requestSignup(vm.request).then(successRequestSignup, _errored);
        }

        function activate() {
            console.log("activating");
            vm.request.current_city = LocationManager.getCurrentCity();
        }

        function selectCity(city) {
            vm.request.current_city = city;
        }

        function successRequestSignup() {
            $state.go('general-message', {
                'module_name' : 'authentication',
                'template_name' : 'request_signup_success',
                'redirect_state' : 'home'
            });
        }

        function _clearErrors() {
            vm.errors = null;
            vm.errors = {};
        }

        function _addError(field, message) {
            vm.errors[field] = message;
            vm.pre_signup_form[field].$setValidity(message, false);
        }

        function _errored(response) {
            var errors = response.data;
            if (errors) {
                angular.forEach(errors, function (errors, field) {
                    _addError(field, errors[0]);
                });
            }
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