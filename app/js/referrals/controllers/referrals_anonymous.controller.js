
/**
 * @ngdoc controller
 * @name trulii.landing.controllers.HomeController
 * @description HomeController
 * @requires trulii.activities.services.ActivitiesManager
 */

(function () {
    'use strict';

    angular
        .module('trulii.referrals.controllers')
        .controller('ReferralsAnonCtrl', HomeController);

    HomeController.$inject = [];

    function HomeController() {

        var vm = this;
        angular.extend(vm, {
            showVideo: false

        });

        _activate();

        vm.toggleVideoShow = function(){
          vm.showVideo = !vm.showVideo;
        }
        //--------- Internal Functions ---------//

        function _setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }

            angular.extend(vm.strings, {
                HEADER_TITLE_COPY: "¡Gana cupones de Trulii por COP 20.000 por cada amigo que invites!",
                HEADER_TEXT_COPY: "¿No tienes cuenta aún?",
                HEADER_ACTION_REGISTER: "Regístrate",
                HEADER_ACTION_LOGIN: "Iniciar sesión para invitar a mis amigos",
                BODY_TEXT_1: "Invita a tus amigos por ",
                BODY_TEXT_2: "correo electrónico",
                BODY_TEXT_3: "o",
                BODY_TEXT_4: "redes sociales",
                BODY_TEXT_5: "a que se unan a Trulii. Una vez registrados, estos recibirán un",
                BODY_TEXT_6: "cupón por COP 20.000,",
                BODY_TEXT_7: "y tú recibirás el tuyo apenas se inscriban a una actividad paga. Tu cupón lo podrás aplicar en tu próxima inscripción a una actividad.",
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
                LEARN_MORE: "Aprende más sobre cómo funciona nuestro sistema de invitaciones"

            });
        }

        function _activate(){
            _setStrings();
        }

    }
})();
