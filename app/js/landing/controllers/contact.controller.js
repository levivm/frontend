
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

    ContactController.$inject = ['$state', '$stateParams', 'cities', 'Contact', 'Toast', 'Analytics'];

    function ContactController($state, $stateParams, cities, Contact, Toast, Analytics) {
        var vm = this;

        angular.extend(vm, {
            cities : cities,
            topics : [],
            selectedCity : null,
            selectedTopic : null,
            selectedSubtopic : null,
            sendContactForm : sendContactForm,
            formData : {
                'name': null,
                'email': null,
                'phone_number': null,
                'description': null
            },
            sent: false
        });

        var toState = {};

        _activate();

        //--------- Functions Implementation ---------//

        function sendContactForm(){

            if(isFormComplete()){
                var data = {
                    'topic': vm.selectedTopic.id,
                };
                angular.extend(data, vm.formData);

                //console.log('data:', data);
                Contact.sendContactForm(data).then(success, error);
            } else {
                console.log('Incomplete Form');
                Toast.error(vm.strings.COPY_ALL_FIELDS_REQUIRED);
            }

            function success(response){
                console.log('Success Sending Contact Form');
                vm.sent = true;
                Toast.success(vm.strings.COPY_SUCCESS_SENDING_FORM);
                Analytics.generalEvents.contactUs('sent contact form')
                $state.go(toState.state, toState.params);
            }
            function error(response){
                console.log('Error Sending Contact Form.', response);
                Toast.error(vm.strings.COPY_ERROR_SENDING_FORM);
            }

            function isFormComplete(){
                return areValidSelects() && areValidFields();

                function areValidSelects(){
                    return vm.selectedTopic && vm.selectedTopic.hasOwnProperty('id')
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
                ACTION_SEND: "Enviar ahora",
                CONTACT_COVER_TITLE_1: "Puedes encontrarnos",
                CONTACT_COVER_TITLE_2: "literalmente en donde sea",
                CONTACT_COVER_TEXT: "Hablamos en serio cuando decimos que nos encantaría saber de ti.",
                CONTACT_SUCCESS_COVER_TITLE: "¡Cool!",
                CONTACT_SUCCESS_COVER_TEXT: "Dentro de poco atenderemos tu solictud",
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
                OPTION_TOPIC_DEFAULT: "Tema",
                OPTION_SUBTOPIC_DEFAULT: "Seleccione un sub-tópico",
                OPTION_CITY_DEFAULT: "Seleccione ciudad",
                PLACEHOLDER_DESCRIPTION: "Cuéntanos, ¿en qué podemos colaborarte?"
            });
        }

        function _activate(){
            _setStrings();
            _getTopics();
            toState = $stateParams.toState;
            console.log('toState:', toState);

        }

    }
})();
