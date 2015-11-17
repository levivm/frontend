
/**
 * @ngdoc controller
 * @name trulii.about.controllers
 * @description AboutController
 */

(function () {
    'use strict';

    angular
        .module('trulii.about.controllers')
        .controller('AboutController', AboutController);

    AboutController.$inject = [];

    function AboutController() {
        var vm = this;

        _activate();

        //--------- Functions Implementation ---------//

        function _setStrings(){
            if(!vm.strings){ vm.strings = {}; }
            angular.extend(vm.strings, {
                TEAM_TITLE_COPY: "Trabajamos para deleitarte",
                TEAM_TITLE_TEXT_COPY: "Poniéndole mucho corazón y talento para alcanzar la excelencia",
                MISSION_TITLE_COPY: "Ofreciendo una nueva forma",
                MISSION_TITLE_TEXT_COPY: "de encontrar y aprender lo que te apasiona en tu ciudad. Y apenas estamos calentando motores...",
                CULTURE_TITLE_COPY: "Comienza el viaje",
                CULTURE_TITLE_TEXT_COPY: "Nuesto deseo es lelgar a cada rincón del planeta.",
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
                FOOTER_LINKS_SOCIAL_HEADER: "¡Sé nuestro amigo!"
            });
        }

        function _activate(){
            _setStrings();
            console.log(vm.strings);
        };

    }
})();
