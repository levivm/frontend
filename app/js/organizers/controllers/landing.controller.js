(function () {
    'use strict';

    angular
        .module('trulii.organizers.controllers')
        .controller('OrganizerLandingCtrl', OrganizerLandingCtrl)

    OrganizerLandingCtrl.$inject = ['$state','LocationManager','Authentication','cities'];

    function OrganizerLandingCtrl($state,LocationManager,Authentication,cities) {
        var vm = this;

        vm.request_signup = requestSignup;
        vm.cities = cities;
        vm.errors = {};
        vm.request = {};
        vm.strings = {};
        vm.strings.PLACEHOLDER_EMAIL = 'Correo Electrónico';
        vm.strings.PLACEHOLDER_NAME = 'Nombre de Compañía';
        vm.strings.PLACEHOLDER_TELEPHONE = 'Teléfono';
        vm.strings.PLACEHOLDER_WANT_TEACH = '¿Qué deseas enseñar?';
        vm.strings.REQUEST_SIGNUP_LABEL = 'Solicitar registro';

        activate();



        /**
        * @name requestSignup
        * @desc Anonymous user request a organizer signup
        * @memberOf trulii.organizers.controllers.OrganizerLandingCtrl
        */
        function requestSignup() {

            _clearErrors();
            vm.request.city = vm.request.current_city.id;
            Authentication.requestSignup(vm.request).then(successRequestSignup,_errored);


        }

        function activate(){

            console.log("activating");
            LocationManager.getCurrentCity().then(success, error);

            function success(city){
                vm.request.current_city = city;
                console.log('getCurrentCity: ', vm.request.current_city);
            }
            function error(){
                console.log("Couldn't obtain current city");
            }


        }

        function selectCity(city){
            vm.request.current_city = city;
        }


        function successRequestSignup(){

            $state.go('general-message',{'module_name':'authentication',
                           'template_name':'request_signup_success',
                           'redirect_state':'home'});

        }

        function _clearErrors(){
          vm.errors = null;
          vm.errors = {};
        }



        function _addError(field, message) {

          vm.errors[field] = message;
          vm.pre_signup_form[field].$setValidity(message, false);

        };




        function _errored(response) {

            var errors = response.data;
            if (errors) {

                angular.forEach(errors, function(errors, field) {

                  _addError(field, errors[0]);

            });

          }
        }


    }
})();