/**
 * @ngdoc directive
 * @name trulii.ui-components.directives.truliiFooter
 * @description truliiFooter
 */

(function () {
    'use strict';

    angular.module('trulii.ui-components.directives')
        .directive('truliiFooter', truliiFooter);

    truliiFooter.$inject = ['UIComponentsTemplatesPath'];

    function truliiFooter(UIComponentsTemplatesPath) {
        return {
            restrict: 'AE',
            templateUrl: UIComponentsTemplatesPath + "trulii-footer.html",
            link: function (scope) {

                _activate();

                function _setStrings() {
                    if (!scope.strings) {
                        scope.strings = {};
                    }

                    angular.extend(scope.strings, {
                        FOOTER_LINKS_ABOUT_US_HEADER: "Conócenos",
                        FOOTER_LINKS_ABOUT_US_ABOUT: "Sobre Nosotros",
                        FOOTER_LINKS_ABOUT_US_BLOG: "Blog",
                        FOOTER_LINKS_ABOUT_US_TERMS: "Términos y Condiciones",
                        FOOTER_LINKS_ABOUT_US_PRIVACY: "Políticas de Privacidad",
                        FOOTER_LINKS_ABOUT_US_CONTACT: "Contáctanos",
                        FOOTER_LINKS_STUDENTS_HEADER: "Asistentes",
                        FOOTER_LINKS_STUDENTS_HOW: "¿Cómo funciona?",
                        FOOTER_LINKS_STUDENTS_SUGGEST: "Sugiere un organizador",
                        FOOTER_LINKS_STUDENTS_INVITE: "Invita a un amigo",
                        FOOTER_LINKS_STUDENTS_FEEDBACK: "Danos tu feedback",
                        FOOTER_LINKS_STUDENTS_HELP: "Ayuda",
                        FOOTER_LINKS_STUDENTS_FAQ: "FAQ",
                        FOOTER_LINKS_ORGANIZER_HEADER: "Organizador",
                        FOOTER_LINKS_ORGANIZER_BE: "Sé Organizador",
                        FOOTER_LINKS_ORGANIZER_HOW: "¿Cómo funciona?",
                        FOOTER_LINKS_ORGANIZER_GUIDE: "Guía del Organizador",
                        FOOTER_LINKS_ORGANIZER_FEEDBACK: "Danos tu feedback",
                        FOOTER_LINKS_ORGANIZER_HELP: "Ayuda",
                        FOOTER_LINKS_ORGANIZER_FAQ: "FAQ",
                        FOOTER_LINKS_SOCIAL_HEADER: "¡Sé nuestro amigo!"
                    });
                }

                function _activate() {
                    _setStrings();
                }
            }
        }
    }

})();
