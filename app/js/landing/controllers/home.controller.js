
/**
 * @ngdoc controller
 * @name trulii.landing.controllers.HomeController
 * @description HomeController
 * @requires trulii.activities.services.ActivitiesManager
 */

(function () {
    'use strict';

    angular
        .module('trulii.landing.controllers')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['ActivitiesManager', 'video'];

    function HomeController(ActivitiesManager, video) {

        var vm = this;
        angular.extend(vm, {
            activities : [],
            options : {
                actions: ['view', 'edit', 'contact', 'manage', 'republish']
            },
            showVideo: false

        });

        _activate();

        vm.toggleVideoShow = function(){
          vm.showVideo = !vm.showVideo;
        }
        //--------- Internal Functions ---------//

        function _getActivities(){
            ActivitiesManager.getActivities().then(success, error);

            function success(response){
                vm.activities = response;
            }
            function error(response){
                console.log('getActivities. Error obtaining Activities from ActivitiesManager');
            }
        }

        //function _setStrings(){
        //    if(!vm.strings){ vm.strings = {}; }
        //    angular.extend(vm.strings, {});
        //}
        function _setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }

            angular.extend(vm.strings, {
                HEADER_TITLE_COPY: "¡Hoy es un nuevo día para aprender!",
                HEADER_TEXT_COPY: "Consigue e inscríbete en las mejores actividades y eventos educativos de tu ciudad",
                HEADER_SEARCH_PLACEHOLDER: "¿Qué quieres aprender hoy?",
                HEADER_CITY_PLACEHOLDER: "Elige tu ciudad",
                REASON_NO_COMMISSIONS: "Sin comisiones",
                REASON_COPY_NO_COMMISSIONS: "En serio ¡Te lo prometemos!",
                REASON_REFUND: "Devolución Garantizada",
                REASON_COPY_REFUND: "Por si no se realiza la actividad",
                REASON_SECURE: "Pago seguro",
                REASON_COPY_SECURE: "Inscríbete con tranquilidad",
                ACTIVITIES_TITLE_COPY: "Actividades",
                ACTIVITIES_TEXT_COPY: "Encuentra en tu ciudad talleres, cursos, diplomados y ponencias de cualquier tipo. Tú eliges.",
                ACTIVITIES_BUTTON_COPY: "Ver más actividades",
                VIDEO_COPY: "¡Con Trulii puedes ser quien tú quieras!",
                CATEGORIES_TITLE_COPY: "Categorías",
                CATEGORIES_TEXT_COPY: "Habla un nuevo idioma. Aprende a tocar un nuevo instrumento. Ponte en forma. Mejora tu currículo. ¡Aprende lo que quieras!",
                HOW_TITLE_COPY: "¿Cómo funciona?",
                HOW_TEXT_COPY: "En cada rincón de tu ciudad existe algo nuevo que aprender. Nosotros te lo facilitamos en tres pasos:",
                HOW_FIND_COPY: "Encuentra",
                HOW_FIND_TEXT: "Lo que quieras aprender",
                HOW_SIGN_UP_COPY: "Inscríbete",
                HOW_SIGN_UP_TEXT: "Tu pago está en buenas manos con nosotros",
                HOW_LEARN_COPY: "Aprende",
                HOW_LEARN_TEXT: "La vida es corta. ¡Aprende todo lo que puedas!",
                PUBLISH_COPY: "¿Quieres publicar una actividad?",
                PUBLISH_TEXT_1: "Trulii es el mejor espacio para",
                PUBLISH_TEXT_2: "dar a conocer",
                PUBLISH_TEXT_3: "tu actividad. Bien sea un curso de cocina, una classe de crossfit, un foro de negocios o un diplomado universitario, nosotros",
                PUBLISH_TEXT_4: "te abrimos la puerta",
                PUBLISH_TEXT_5: "a nuevos clientes y hacemos el trabjao sucio por ti.",
                PUBLISH_TEXT_6: "Regístrate",
                PUBLISH_TEXT_7: "sin costo alguno",
                PUBLISH_TEXT_8: "y disfruta de nuestra prueba",
                PUBLISH_TEXT_9: "gratuita",
                PUBLISH_TEXT_10: "en tus primeras tres actividades.",
                PUBLISH_TEXT_11: "¡Crece con nosotros!",
                PUBLISH_BUTTON_COPY: "Ser organizador",
                CATEGORY_FITNESS: "Fitness",
                CATEGORY_MUSIC: "Música",
                CATEGORY_LIFESTYLE: "Estilo de vida",
                CATEGORY_PROFESSIONAL: "Profesional",
                CATEGORY_ART: "Arte",
                CATEGORY_TECHNOLOGY: "Tecnología",
                CATEGORY_KIDS: "Niños",
                CATEGORY_GASTRONOMY: "Gastronomía",
                CATEGORY_LANGUAGES: "Idiomas",
                CATEGORY_DANCE: "Danza",
                FOOTER_LINKS_ABOUT_US_HEADER: "Conócenos",
                FOOTER_LINKS_ABOUT_US_ABOUT: "Sobre Nosotros",
                FOOTER_LINKS_ABOUT_US_BLOG: "Blog",
                FOOTER_LINKS_ABOUT_US_TERMS: "Términos y Condiciones",
                FOOTER_LINKS_ABOUT_US_PRIVACY: "Políticas de Privacidad",
                FOOTER_LINKS_ABOUT_US_CONTACT: "Contáctanos",
                FOOTER_LINKS_STUDENTS_HEADER: "Asistentes",
                FOOTER_LINKS_STUDENTS_HOW: "¿Cómo funciona?",
                FOOTER_LINKS_STUDENTS_SUGGEST: "Sugiere un organizador",
                FOOTER_LINKS_STUDENTS_FEEDBACK: "Danos tu feedback",
                FOOTER_LINKS_STUDENTS_SUPPORT: "Soporte",
                FOOTER_LINKS_STUDENTS_FAQ: "FAQ",
                FOOTER_LINKS_ORGANIZER_HEADER: "Organizador",
                FOOTER_LINKS_ORGANIZER_BE: "Sé Organizador",
                FOOTER_LINKS_ORGANIZER_HOW: "¿Cómo funciona?",
                FOOTER_LINKS_ORGANIZER_TIPS: "Tips para publicar",
                FOOTER_LINKS_ORGANIZER_FEEDBACK: "Dano tu feedback",
                FOOTER_LINKS_ORGANIZER_SUPPORT: "Soporte",
                FOOTER_LINKS_ORGANIZER_FAQ: "FAQ",
                FOOTER_LINKS_SOCIAL_HEADER: "¡Sé nuestro amigo!",

            });
        }

        function _activate(){
            _setStrings();
            _getActivities();
            video.addSource('webm', '/videos/home1.webm');
            video.addSource('webm', '/videos/home2.webm');
            video.addSource('webm', '/videos/home3.webm');
        }

    }
})();
