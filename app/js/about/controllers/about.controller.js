
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

    AboutController.$inject = ['$scope', '$window'];

    function AboutController($scope, $window) {
        var vm = this;

        angular.extend(vm,{
          scroll: 0,
          widgetOriginalPosition: 0,
          widgetMaxPosition: 0,
          widgetAbsolutePosition: 0
        });

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
                CULTURE_TITLE_TEXT_COPY: "Nuesto deseo es llegar a cada rincón del planeta.",
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

        function _initWidget(){
            angular.element(document).ready(function () {
                vm.scroll = document.body.scrollTop;
                vm.widgetMaxPosition = document.getElementsByClassName('home-footer')[0].getBoundingClientRect().top + window.scrollY - document.getElementsByClassName('navigation-widget')[0].offsetHeight * 2;
                $window.onscroll = function(){
                    vm.widgetMaxPosition = document.getElementsByClassName('home-footer')[0].getBoundingClientRect().top + window.scrollY - document.getElementsByClassName('navigation-widget')[0].offsetHeight * 2;
                    vm.scroll = document.body.scrollTop;
                    $scope.$apply();
                    console.log(vm.widgetMaxPosition);
                    console.log(vm.scroll);
                };
            });
        }


        function _activate(){
            _setStrings();
            _initWidget();
            console.log(vm.widgetMaxPosition);
            console.log(vm.scroll);
        };

    }
})();
