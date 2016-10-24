/**
 * @ngdoc controller
 * @name trulii.activities.controllers.CategoryController
 * @description Controller for Activity Detail Component. Handles
 * display of activity info, available calendars and assistants.
 * @requires ui.router.state.$state
 * @requires ng.$window
 * @requires uiGmapgoogle-maps.providers.uiGmapGoogleMapApi
 * @requires trulii.ui-components.services.Toast
 * @requires cities
 * @requires activity
 * @requires calendars
 */

(function () {
    'use strict';

    angular
        .module('trulii.activities.controllers')
        .controller('CategoryController', CategoryController);

    CategoryController.$inject = ['$scope', '$state', '$stateParams', '$filter', '$location', 'moment', 'Elevator',
        'Toast', 'serverConf', 'Scroll', 'Facebook', 'Analytics', 'SearchManager', 'LocationManager', 'category', 'categoryActivities'];

    function CategoryController($scope, $state, $stateParams, $filter, $location, moment, Elevator,
                                      Toast, serverConf, Scroll, Facebook, Analytics, SearchManager, LocationManager, category, categoryActivities) {
                                          
        var vm = this;

        angular.extend(vm, {
            getAmazonUrl: getAmazonUrl,
            category: category.data,
            categoryActivities: categoryActivities.results,
            cards: [],
            searchData: {}
        });

        _activate();

        //--------- Exposed Functions ---------//

        function getAmazonUrl(file){
            return  serverConf.s3URL + '/' + file;
        }

        //--------- Internal Functions ---------//

        function _mapTemplates(){
            for(var i = 0; i < vm.categoryActivities.length; i++){
                vm.categoryActivities[i].template = "partials/activities/dynamic_layout_item.html";
            }
            vm.categoryActivities = vm.categoryActivities.splice(0, 8);
            vm.cards = vm.categoryActivities;
        }

        function _setSearchData(){
            SearchManager.setCategory(vm.category.id);
            vm.currentCity = LocationManager.getCurrentCity();
            SearchManager.setCity(vm.currentCity.id);
            vm.searchData = SearchManager.getSearchData();
        }
        function _removeScriptSeo() {
            var element = document.getElementById('seoJson');
            if(!element){
                return true;
            }else{
                 document.getElementsByTagName("head")[0].removeChild (element);
                 _removeScriptSeo();
            }
        }
        function _initObjectsSeo(){
            var websiteObj = {
                "@context": "http://schema.org",
                "@type": "WebSite",
                "name": "Trulii",
                "url": "https://trulii.com",
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://trulii.com/buscar?city=1&category="+vm.category.id+"&cost_start=30000&cost_end=1000000&page=1"
                }
            }
            var breadCrumbObj = {
                "@context": "http://schema.org",
                "@type":"BreadcrumbList",
                "itemListElement":[  
                    {  
                        "@type":"ListItem",
                        "item":{  
                            "@id":"https://trulii.com",
                            "name":"Home",
                            "url":"https://trulii.com"
                        },
                        "position":1
                    },
                    {  
                        "@type":"ListItem",
                        "item":{  
                            "@id":"https://trulii.com/actividades/"+vm.category.slug,
                            "name":vm.category.name,
                            "image": getAmazonUrl(vm.category.cover_photo),
                            "url":"https://trulii.com/actividades/"+vm.category.slug
                        },
                        "position":2
                    }
                ]
            }
            _removeScriptSeo();
            _setSeoScript(websiteObj);
            _setSeoScript(breadCrumbObj);
        }
        function  _setSeoScript(dataObj) {
            var script   = document.createElement("script");
            script.type  = "application/ld+json"; // use this for linked script
            script.text  = JSON.stringify(dataObj)
            script.id= "seoJson";
            document.getElementsByTagName("head")[0].appendChild(script); 
        }

        function _setStrings(){
            if(!vm.strings){ vm.strings = {}; }
            angular.extend(vm.strings, {
                ACTION_CONTACT_US: "Contáctanos",
                ACTION_SIGN_UP: "Inscribirme",
                ACTION_VIEW_OTHER_DATES: "Ver más fechas de inicio",
                COPY_SIMILAR_ACTIVITIES: "Actividades Similares",
                COPY_MORE_SIMILAR_ACTIVITIES: "Ver más actividades similares",
                COPY_TO: " a ",
                COPY_FREE: " Gratis",
                COPY_VACANCY_SINGULAR: " vacante",
                COPY_VACANCY: " vacantes",
                COPY_NO_VACANCY: "Sin vacantes",
                COPY_ONE_REVIEW: " Evaluación",
                COPY_OTHER_REVIEWS: " Evaluaciones",
                COPY_HEADER_SIGN_UP: "¿Todo listo para aprender?",
                COPY_SIGN_UP: "Inscribirse es más rápido que Flash, más seguro que Islandia y más fácil que la tabla del 1. ¡En serio!",
                COPY_SIGN_UP_NO_DATES: "Por ahora no hay fechas disponibles para la clase, agrégala a favoritos y te avisaremos cuando hayan más fechas disponibles.",
                COPY_HEADER_REASONS_TO_USE: "¿Por qué inscribirte con Trulii?",
                COPY_DOUBTS:"¿Alguna duda? Estamos a tu orden todos los días",
                LABEL_SCHEDULE: "Horario",
                LABEL_START: "Inicio",
                LABEL_VACANCY: "Vacantes",
                LABEL_SESSIONS_NUMBER: "N° de Clases",
                LABEL_COST: "Precio",
                LABEL_NEXT_DATE: "Próxima fecha de inicio",
                LABEL_CLOSING_DATE: "Ventas hasta",
                LABEL_LEVEL: "Nivel",
                LABEL_DURATION: "Duration",
                LABEL_DESCRIPTION: "Descripción",
                LABEL_GET_TO_KNOW_US: "Conócenos",
                LABEL_CONTENT: "Contenido",
                LABEL_AUDIENCE: "Dirigido a",
                LABEL_ADDRESS: "Dirección",
                LABEL_GOALS: "Objetivo",
                LABEL_INSTRUCTORS: "Instructores",
                LABEL_REQUIREMENTS: "Requisitos",
                LABEL_METHODOLOGY: "Metodología",
                LABEL_EXTRA_INFO: "Info Extra",
                LABEL_RETURN_POLICY: "Política de Devolución",
                LABEL_MORE_COMMENTS: "Ver más comentarios",
                TITLE_INVALID_USER: "Sólo estudiantes pueden inscribirse en una Actividad",
                TITLE_INVALID_LIKE_USER: "Sólo estudiantes pueden agregar una actividad a mis favoritos",
                MSG_INVALID_USER: "Acción no permitida para tipo de usuario",
                VALUE_WITH_CERTIFICATION: "Con Certificado",
                VALUE_WITHOUT_CERTIFICATION: "Sin Certificado",
                VALUE_DOESNT_APPLY: "No aplica",
                VALUE_LEVEL: "Nivel",
                VALUE_DURATION: "Duración",
                REASON_NO_COMMISSIONS: "Sin Comisiones",
                REASON_COPY_NO_COMMISSIONS_1: "Nuestro servicio para ti",
                REASON_COPY_NO_COMMISSIONS_2: "es totalmente gratuito.",
                REASON_REFUND: "Devolución Garantizada",
                REASON_COPY_REFUND_1: "Protegemos tu pago hasta",
                REASON_COPY_REFUND_2: "que se efectúe la clase.",
                REASON_SECURE: "Pago Seguro",
                REASON_COPY_SECURE_1: "Los datos del pago de tu",
                REASON_COPY_SECURE_2: "inscripción están seguros",
                REASON_COPY_SECURE_3: "con nosotros.",
                EMAIL_MODAL_HEADER: "Compartir la actividad correo electrónico",
                EMAIL_MODAL_SEND_TO_LABEL: "Enviar a:",
                EMAIL_MODAL_SEND_TO_PLACEHOLDER: "Ingresa correos electronicos. Sepáralos entre sí con comas",
                EMAIL_MODAL_MESSAGE_LABEL: "Escribe un mensaje:",
                EMAIL_MODAL_MESSAGE_PLACEHOLDER: "Hey, échale un vistazo a esta actividad en Trulii. ¡Sé que te encantará!",
                EMAIL_MODAL_SEND: "Enviar",
                EMAIL_MODAL_DISMISS: "Cancelar",
                COPY_SHARE_SUCCESS: "La Actividad fue compartida exitosamente",
                COPY_SHARE_ERROR: "Error compartiendo la actividad, por favor intenta de nuevo",
                COPY_EMPTY_EMAIL: "Por favor agrega al menos un email",
                COPY_EMPTY_MESSAGE: "Por favor agrega un mensaje",
                COPY_EMPTY_REVIEWS: "Aun no hay evaluaciones para esta actividad",
                COPY_NUMBER_OF_LIKES: "personas aman esto",
                COPY_BE_THE_FIRST: "¡Sé el primero!"
            });
        }
        

        function _activate(){
            _setStrings();
            _setSearchData();
            _mapTemplates();
            _initObjectsSeo();
            
            //Function for angularSeo
            /**/
            $scope.htmlReady();
        }
    }
})();
