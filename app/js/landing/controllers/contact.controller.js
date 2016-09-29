
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

    ContactController.$inject = ['$state', '$scope', '$stateParams', 'cities', 'Contact', 'Toast', 'Analytics', 'serverConf'];

    function ContactController($state, $scope, $stateParams, cities, Contact, Toast, Analytics, serverConf) {
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
            sent: false,
            getAmazonUrl: getAmazonUrl
        });

        var toState = {};

        _activate();

        //--------- Functions Implementation ---------//

        function getAmazonUrl(file){
            return  serverConf.s3URL + '/' +  file;
        }

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
                // $state.go(toState.state, toState.params);
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
                CONTACT_COVER_TITLE_1: "Encuéntranos literalmente",
                CONTACT_COVER_TITLE_2: "en donde sea",
                CONTACT_COVER_TEXT: "Para dudas o simplemente conversar con nosotros escríbenos por aquí o en cualquiera de nuestros canales.",
                CONTACT_SUCCESS_COVER_TITLE: "¡Excelente!",
                CONTACT_SUCCESS_COVER_TEXT: "¡Pendiente! Dentro de muy poco contactaremos para conocerte y validar tu solicitud",
                COPY_ALL_FIELDS_REQUIRED: "¡Yuujuuuu, despistad@@@@! Recuerda llenar todos los campos antes de enviar.",
                COPY_SUCCESS_SENDING_FORM: "¡Pendiente! Dentro de muy poco te contactaremos para ayudarte. Nuestro trabajo es hacerte feliz.",
                COPY_ERROR_SENDING_FORM: "Hubo un error enviando tu solicitud. Por favor intenta de nuevo",
                LABEL_CONTACT_US: "Contáctanos",
                LABEL_TOPIC: "Tópico",
                LABEL_SUB_TOPIC: "Sub-Tópico",
                LABEL_DESCRIPTION: "Descripción",
                LABEL_NAME: "Nombre",
                LABEL_EMAIL: "Correo electrónico",
                LABEL_PHONE: "Número de teléfono",
                LABEL_CITY: "Ciudad",
                OPTION_TOPIC_DEFAULT: "Tema",
                OPTION_SUBTOPIC_DEFAULT: "Elige un sub-tópico",
                OPTION_CITY_DEFAULT: "Elige ciudad",
                PLACEHOLDER_DESCRIPTION: "Cuéntanos, ¿en qué podemos colaborarte?"
            });
        }

        function _activate(){
            _setStrings();
            _getTopics();
            toState = $stateParams.toState;
            console.log('toState:', toState);
            //Function for angularSeo
            $scope.htmlReady();
        }

    }
})();
