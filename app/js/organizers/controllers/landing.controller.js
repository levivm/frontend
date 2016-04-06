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


    OrganizerLandingCtrl.$inject = ['LocationManager', 'Authentication', 'Toast', 'Elevator', 'Error', 'cities', 'serverConf', 'Analytics', '$sce', '$stateParams'];
    function OrganizerLandingCtrl(LocationManager, Authentication, Toast, Elevator, Error, cities, serverConf, Analytics, $sce, $stateParams) {

        var vm = this;
        var documentTypes = [{'name': 'NIT', 'id': 'nit'}, {'name': 'CC', 'id': 'cc'}, {'name': 'CE', 'id': 'ce'}];
        angular.extend(vm, {
            cities : cities,
            documentTypes: documentTypes,
            errors : {},
            selectedCity: LocationManager.getCurrentCity(),
            request : {
                document_type: documentTypes[0].id
            },
            sent : false,
            isSigningUp: false,
            requestSignup : requestSignup,
            goToForm: goToForm,
            getAmazonUrl: getAmazonUrl,
            getAmazonVideoUrl: getAmazonVideoUrl
        });

        _activate();

        //--------- Exposed Functions ---------//

        function getAmazonUrl(file){
            return  serverConf.s3URL + '/' +  file;
        }
        function getAmazonVideoUrl(file){
            return  $sce.trustAsResourceUrl( serverConf.s3URL + '/' +  file);
        }

        function requestSignup() {
            vm.request.city = vm.selectedCity.id;
            if(!_validateObject(vm.request)){
                Toast.warning(vm.strings.COPY_EMPTY_FORM);
                return;
            }

            vm.isSigningUp = true;
            Error.form.clear(vm.pre_signup_form);
            Authentication.requestSignup(vm.request).then(success, error);

            function success() {
                vm.isSigningUp = false;
                vm.sent = true;
                Analytics.organizerEvents.requestOrganizer();
            }

            function error(response) {
                vm.isSigningUp = false;
                var responseErrors = response.data;
                if (responseErrors) { Error.form.add(vm.pre_signup_form, responseErrors); }
            }

            function _validateObject(data){
                var properties = ['name', 'email', 'telephone', 'city', 'document_type', 'document'];
                return properties.every(hasKey);

                function hasKey(key){
                    return data.hasOwnProperty(key);
                }
            }
        }

        function goToForm(){
            Elevator.toElement('anchor');
        }

        //--------- Internal Functions ---------//

        function _setStrings() {
            if (!vm.strings) { vm.strings = {}; }
            angular.extend(vm.strings, {
                ACTION_SIGNUP: 'Listo para unirme',
                HEADER_TITLE_COPY: "Enfócate en enseñar lo que te apasiona",
                HEADER_TEXT_COPY: "¡Nosotros nos encargamos del resto!",
                HEADER_ACTION_START_NOW: "Comienza ya",
                PUBLISH_TITLE_COPY: "¿Por qué publicar tu actividad en Trulii?",
                PUBLISH_TEXT_COPY_1: "No hacemos dinero por suscripción ni por publicidad. Solo hacemos dinero si tú tambien lo haces. por lo que estamos juntos en esto. ",
                PUBLISH_DIRT_WORK_TITLE: "Hacemos el trabajo sucio",
                PUBLISH_DIRTY_WORK_TEXT: "Incrementamos las inscripciones, manejamos la atención al cliente y nos aseguramos de que recibas tu dinero.",
                PUBLISH_VISIBILITY_TITLE: "Incrementamos tu visibilidad",
                PUBLISH_VISIBILITY_TEXT: "Impulsamos tu marca a través de nuestro blog, redes sociales y casos de éxito.",
                PUBLISH_EASY_TITLE: "Fácil y cómodo",
                PUBLISH_EAST_TEXT: "Publica de forma fácil y rápida. Además, las publicaciones lucen atractivas para el ojo del posible cliente",
                PUBLISH_TRUST_TITLE: "Genera confianza",
                PUBLISH_TRUST_TEXT: "Nuestra plataforma garantiza a tus posibles clientes seguridad y confianza en el proceso. ¡Saca provecho de ello!",
                HOW_TITLE: "¿Cómo funciona?",
                HOW_TEXT_1: "Llena tus datos y te contactaremos para validarlos.",
                HOW_TEXT_2: "Publica tu actividad y comienza a recibir inscripciones.",
                HOW_TEXT_3: "Enseña lo que te apasiona y recibe tu pago.",
                MORE_INFO_TITLE: "¿Necesitas más información?",
                MORE_INFO_MONETIZATION_TITLE: "Monetización",
                MORE_INFO_MONETIZATION_TEXT: "Solo cobramos 8% por transacción incluyendo la comisión de plataforma de pago. ¿Todo lo demás? Gratuito.",
                MORE_INFO_TIPS_TITLE: "Tips",
                MORE_INFO_TIPS_TEXT_1: "¿Quieres que tu publicación destaque por encima del resto? Te invitamos a que sigas estos",
                MORE_INFO_TIPS_TEXT_2: "tips",
                MORE_INFO_FAQ_TITLE: "Faq",
                MORE_INFO_FAQ_TEXT_1: "En nuestro ",
                MORE_INFO_FAQ_TEXT_2: "FAQ",
                MORE_INFO_FAQ_TEXT_3: "y",
                MORE_INFO_FAQ_TEXT_4: "Soporte",
                MORE_INFO_FAQ_TEXT_5: "puedes encontrar las respuestas. Para más información, ",
                MORE_INFO_FAQ_TEXT_6: "contáctanos.",
                SIGN_UP_TITLE: "¿Listo para ser organizador?",
                SIGN_UP_TEXT: "Llena el formulario y te contactaremos muy pronto.",
                SIGN_UP_SUCCESS_TITLE: "¡Cool!",
                SIGN_UP_SUCCESS_TEXT_1: "Dentro de poco te contactaremos.",
                SIGN_UP_SUCCESS_TEXT_2: "¡Eres lo máximo!",
                PLACEHOLDER_NAME: 'Nombre del Organizador',
                PLACEHOLDER_EMAIL: "Correo electrónico",
                PLACEHOLDER_TELEPHONE: 'Número teléfonico',
                PLACEHOLDER_DOCUMENT: '# de Documento',
                PLACEHOLDER_CITY: "Ciudad",
                LABEL_DOCUMENT_TYPE: "Tipo de Documento",
                LABEL_DOCUMENT: "Documento",
                LABEL_CITY: "Ciudad",
                COPY_EMPTY_FORM: "Por favor llene el formulario de registro"
            });
        }
        function _fromBurgerMenu(){

          if ($stateParams.from_burger){
              setTimeout(function(){ Elevator.toElement('anchor-how'); }, 1000);
              $stateParams.from_burger=null;
          }

        }
        function _activate() {
            _setStrings();
            _fromBurgerMenu();
        }
    }
})();
