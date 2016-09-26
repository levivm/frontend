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


    OrganizerLandingCtrl.$inject = ['$scope', 'LocationManager', 'Authentication', 'Toast', 'Elevator', 'Error', 'cities', 'serverConf', 'Analytics', '$sce', '$stateParams'];
    function OrganizerLandingCtrl($scope, LocationManager, Authentication, Toast, Elevator, Error, cities, serverConf, Analytics, $sce, $stateParams) {

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
                ACTION_SIGNUP: 'Aumentar mis ventas',
                HEADER_TITLE_COPY_1: "Aumenta tus ventas y alcance",
                HEADER_TITLE_COPY_2: "sin esfuerzo alguno",
                HEADER_TEXT_COPY: "Prepara tu clase con tranquilidad, nosotros nos encargamos del resto.",
                HEADER_ACTION_START_NOW: "Regístrate gratis",
                PUBLISH_TITLE_COPY: "¿Por qué publicar tu actividad en Trulii?",
                PUBLISH_TEXT_COPY_1: "Somos la única plataforma para organizadores de clases que realmente busca aumentar tus",
                PUBLISH_TEXT_COPY_2: "inscripciones, ya que sólo hacemos dinero cuando tú lo haces, sino sería injusto, ¿no?",
                PUBLISH_1_TITLE: "Aumenta tus ingresos",
                PUBLISH_1_TEXT: "Sabemos cómo aumentar tus ventas porque el marketing es lo nuestro.",
                PUBLISH_2_TITLE: "Expande tu alcance",
                PUBLISH_2_TEXT: "Impulsamos tu marca y tus actividades a través de diferentes canales como blog, videos, redes sociales, emails, etc.",
                PUBLISH_3_TITLE: "Fácil y llamativo",
                PUBLISH_3_TEXT: "Publicar una actividad es facilísimo. Tu publicación quedará hermosa y muy llamativa.",
                PUBLISH_4_TITLE: "Genera confianza",
                PUBLISH_4_TEXT_1: "Nuestra plataforma garantiza a tus posibles clientes seguridad y confianza en el proceso.",
                PUBLISH_4_TEXT_2: "¡Saca provecho de ello!",
                HOW_TITLE: "¿Cómo funciona?",
                HOW_TEXT_1: "Llena tus datos y te contactaremos para validarlos.",
                HOW_TEXT_2: "Publica tu actividad GRATIS y comienza a recibir inscripciones.",
                HOW_TEXT_3: "Imparte tus clases y recibe tu dinero en tu cuenta bancaria.",
                HOW_TEXT_4: "Recibe y responde las evaluaciones que los asistentes le dieron a tu actividad.",
                MORE_INFO_TITLE: "¿Necesitas más información?",
                MORE_INFO_MONETIZATION_TITLE: "Monetización",
                MORE_INFO_MONETIZATION_TEXT_1: "Nuestra única ganancia es una pequeña comisión por cada inscripción que recibas.",
                MORE_INFO_MONETIZATION_TEXT_2: "Regístrate",
                MORE_INFO_MONETIZATION_TEXT_3: "gratis y te contamos.",
                MORE_INFO_TIPS_TITLE: "Tips",
                MORE_INFO_TIPS_TEXT_1: "¿Quieres que tu publicación destaque? Sigue estos",
                MORE_INFO_TIPS_TEXT_2: "tips",
                MORE_INFO_TIPS_TEXT_3: "para aumentar las ventas de tu publicación",
                MORE_INFO_FAQ_TITLE: "¿Alguna pregunta?",
                MORE_INFO_FAQ_TEXT_1: "Para más información ",
                MORE_INFO_FAQ_TEXT_2: "Contáctanos",
                MORE_INFO_FAQ_TEXT_3: " que con mucho gusto te aclararemos cualquier duda.",
                SIGN_UP_TITLE: "¿Te animas a publicar tu actividad con nosotros?",
                SIGN_UP_TEXT: "Regístrate gratis y te contactaremos en menos de una hora para validar tu información. ¡Sí, en menos de una hora!",
                SIGN_UP_SUCCESS_TITLE_1: "Ten el teléfono a mano, que ya te llamamos.",
                SIGN_UP_SUCCESS_TITLE_2: "¡Eres lo máximo!",
                PLACEHOLDER_NAME: 'Daniel Pérez',
                PLACEHOLDER_EMAIL: "nombre@trulii.com",
                PLACEHOLDER_TELEPHONE: 'Ej. 3099988000',
                PLACEHOLDER_DOCUMENT: 'Número',
                PLACEHOLDER_CITY: "Ciudad",
                LABEL_NAME: 'Nombre del Organizador',
                LABEL_EMAIL: "Correo electrónico",
                LABEL_TELEPHONE: 'Número teléfonico',
                LABEL_DOCUMENT_TYPE: "Documento de identidad",
                LABEL_DOCUMENT: "Documento",
                LABEL_CITY: "Ciudad",
                COPY_EMPTY_FORM: "Por favor llene el formulario de registro",
                ORGANIZERS_BELIEVE_IN_TRULII: "Estos organizadores confían en Trulii. Sólo faltas tú"
            });
        }
        function _fromBurgerMenu(){

          if ($stateParams.from_menu){
              setTimeout(function(){ Elevator.toElement('anchor-how'); }, 2000);
              $stateParams.from_menu=null;
          }

        }
        function _activate() {
            _setStrings();
            _fromBurgerMenu();
            $scope.htmlReady();

            //Function for angularSeo
            $scope.htmlReady();
        }
    }
})();
