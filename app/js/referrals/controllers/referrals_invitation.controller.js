
/**
 * @ngdoc controller
 * @name trulii.referrals.controllers.ReferralsInvitationCtrl
 * @description ReferralsInvitationCtrl
 * @requires trulii.activities.services.ActivitiesManager
 */

(function () {
    'use strict';

    angular
        .module('trulii.referrals.controllers')
        .controller('ReferralsInvitationCtrl', ReferralsInvitationCtrl);

    ReferralsInvitationCtrl.$inject = ['$state', 'referrer', 'student'];

    function ReferralsInvitationCtrl($state, referrer, student) {

        var vm = this;
        angular.extend(vm, {
            showVideo: false,
            referrer: referrer,
            student: student,
            stateInfo : {
                toState: {
                    state: 'referrals.invitation',
                    params: {
                        idReferrer: referrer.referrer_code
                    }
                }
            },
            toggleVideoShow: toggleVideoShow,
            claimCoupon: claimCoupon,
            register: register,
            login: login
        });

        _activate();

        //--------- Exposed Functions ---------//

        function toggleVideoShow(){
          vm.showVideo = !vm.showVideo;
        }

        function claimCoupon(){

        }

        function register(){
            $state.go('register', vm.stateInfo);
        }

        function login(){
            $state.go('login', vm.stateInfo);
        }

        //--------- Internal Functions ---------//

        function _setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }

            angular.extend(vm.strings, {
                HEADER_TITLE_COPY_1: "te dio COP",
                HEADER_TITLE_COPY_2: "de cupón",
                HEADER_TEXT_COPY: "Trulii es la mejor forma de encontrar e inscribirte en lo que quieres aprender en tu ciudad",
                ACTION_REGISTER: "Regístrate",
                ACTION_LOGIN: "Inicia Sesión",
                COPY_TO_CLAIM_COUPON: "Ya te falta solo un paso para reclamar tu cupón",
                ACTION_REDEEM: "Reclamar cupón",
                REASON_NO_COMMISSIONS: "Sin comisiones",
                REASON_COPY_NO_COMMISSIONS: "En serio ¡Te lo prometemos!",
                REASON_REFUND: "Devolución Garantizada",
                REASON_COPY_REFUND: "Por si no se realiza la actividad",
                REASON_SECURE: "Pago seguro",
                REASON_COPY_SECURE: "Inscríbete con tranquilidad",
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
                LEARN_MORE: "Aprende más sobre cómo funciona nuestro sistema de invitaciones"

            });
        }

        function _activate(){
            _setStrings();
            console.log('referrer:', referrer);
        }

    }
})();
