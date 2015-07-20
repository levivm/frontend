
/**
 * @ngdoc controller
 * @name trulii.landing.controllers.ContactController
 * @description ContactController
 * @requires trulii.locations.services.LocationManager
 * @requires cities
 */

(function () {
    'use strict';

    angular
        .module('trulii.landing.controllers')
        .controller('ContactController', ContactController);

    ContactController.$inject = ['$state', 'cities', 'Contact', 'Toast'];

    function ContactController($state, cities, Contact, Toast) {
        var vm = this;

        vm.cities = cities;
        vm.topics = [];
        vm.selectedCity = null;
        vm.selectedTopic = null;
        vm.selectedSubtopic = null;
        vm.sendContactForm = sendContactForm;
        vm.formData = {
            'name': null,
            'email': null,
            'phone_number': null,
            'description': null
        };

        _activate();

        //--------- Functions Implementation ---------//

        function sendContactForm(){
            if(isFormComplete()){
                var data = {
                    'topic': vm.selectedTopic.id,
                    'subtopic': vm.selectedSubtopic.id,
                    'city': vm.selectedCity.name
                };
                angular.extend(data, vm.formData);

                console.log('data:', data);
                Contact.sendContactForm(data).then(success, error);
            } else {
                console.log('Incomplete Form');
                Toast.error(vm.strings.COPY_ALL_FIELDS_REQUIRED);
            }

            function success(response){
                console.log('Success Sending Contact Form');
                Toast.success(vm.strings.COPY_SUCCESS_SENDING_FORM);
                $state.go('home');
            }
            function error(response){
                console.log('Error Sending Contact Form.', response);
                Toast.error(vm.strings.COPY_ERROR_SENDING_FORM);
            }

            function isFormComplete(){
                return areValidSelects() && areValidFields();

                function areValidSelects(){
                    return vm.selectedTopic && vm.selectedTopic.hasOwnProperty('id')
                        && vm.selectedSubtopic && vm.selectedSubtopic.hasOwnProperty('id')
                        && vm.selectedCity && vm.selectedCity.hasOwnProperty('name');
                }
                function areValidFields(){
                    return vm.formData.name && vm.formData.email && vm.formData.phone_number && vm.formData.description;
                }
            }
        }

        function _getTopics(){
            Contact.getTopics().then(success, error);

            function success(topics){
                vm.topics = topics;
            }

            function error(response){
                vm.topics = null;
            }
        }

        function _setStrings(){
            if(!vm.strings){ vm.strings = {}; }
            angular.extend(vm.strings, {
                ACTION_SEND: "Enviar",
                COPY_ALL_FIELDS_REQUIRED: "Por favor llene todos los campos",
                COPY_SUCCESS_SENDING_FORM: "Tu solicitud fue enviada con éxito. Pronto nos pondremos en contacto contigo",
                COPY_ERROR_SENDING_FORM: "Hubo un error enviando tu solicitud. Por faovr intenta de nuevo",
                LABEL_CONTACT_US: "Contáctanos",
                LABEL_TOPIC: "Tópico",
                LABEL_SUB_TOPIC: "Sub-Tópico",
                LABEL_DESCRIPTION: "Descripción",
                LABEL_NAME: "Nombre",
                LABEL_EMAIL: "Email",
                LABEL_PHONE: "Teléfono",
                LABEL_CITY: "Ciudad",
                OPTION_TOPIC_DEFAULT: "Seleccione un tópico",
                OPTION_SUBTOPIC_DEFAULT: "Seleccione un sub-tópico",
                OPTION_CITY_DEFAULT: "Seleccione ciudad",
                PLACEHOLDER_DESCRIPTION: "Describe la inquietud por la que nos contactas"
            });
        }

        function _activate(){
            _setStrings();
            _getTopics();
        }

    }
})();