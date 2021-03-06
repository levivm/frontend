
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

    ReferralsInvitationCtrl.$inject = ['$state', 'referrer', 'generalInfo', 'student', 'serverConf'];

    function ReferralsInvitationCtrl($state, referrer, generalInfo, student, serverConf) {

        var vm = this;
        angular.extend(vm, {
            showVideo: false,
            referrer: referrer,
            student: student,
            stateInfo : {
                toState: {
                    state: 'home'
                },
                refhash: referrer.refhash
            },
            toggleVideoShow: toggleVideoShow,
            claimCoupon: claimCoupon,
            register: register,
            login: login,
            getAmazonUrl: getAmazonUrl,
            organizerCategories: organizerCategories
        });

        _activate();

        //--------- Exposed Functions ---------//

        function getAmazonUrl(file){
            return  serverConf.s3URL + '/' +  file;
        }
        
         function organizerCategories(index){
            return index < 2 ? 'col-md-6' :  index === 5 ?  'col-md-8': 'col-md-4';
        }
        
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

        function _setCategories(){
            vm.categories = angular.copy(generalInfo.categories);
        }

        function _setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }

            angular.extend(vm.strings, {
                HEADER_IS_STUDENT: "Oops! Ya estás registrado en Trulii",
                COPY_IS_STUDENT_HI: "Hola",
                COPY_IS_STUDENT_COPY: ", las invitaciones son una funcionalidad sólo para nuevos usuarios",
                COPY_IS_STUDENT_DISCOVER: "Te invitamos a descubrir nuevas actividades de tu interés",
                HEADER_TITLE_COPY_1: "te dio COP",
                HEADER_TITLE_COPY_2: "de cupón",
                HEADER_TEXT_COPY: "Trulii es la mejor forma de encontrar e inscribirte en lo que quieres aprender en tu ciudad. Utiliza este cupón para inscribirte a cualquier actividad.",
                ACTION_REGISTER: "Regístrate",
                ACTION_LOGIN: "Inicia Sesión",
                ACTION_SEARCH_ACTIVITIES: "Buscar Actividades",
                ACTION_REDEEM: "Registrarte para reclamar tu cupón",
                BENEFITS_TITLE: 'Beneficios',
                REASON_NO_COMMISSIONS: "Sin comisiones",
                REASON_COPY_NO_COMMISSIONS: "En serio ¡Te lo prometemos!",
                REASON_REFUND: "Devolución Garantizada",
                REASON_COPY_REFUND: "Por si no se realiza la actividad",
                REASON_SECURE: "Pago seguro",
                REASON_COPY_SECURE: "Inscríbete con tranquilidad",
                VIDEO_COPY: "¡Con Trulii puedes ser quien tú quieras!",
                VIDEO_TEXT: "Somos una plataforma que facilitará tu aprendizaje, te permitirá aprovechar tu tiempo libre y mejorarará tu currículum. " +
                             "Puedes aprender desde finanzas hasta yoga. Encuentra e inscríbite en las mejores clases y cursos de tu ciudad, todo en un sólo sitio. "+
                             " ¡Conoce más sobre nosotros en este video!",
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
                HOW_REVIEW_COPY: "Evalúa",
                HOW_REVIEW_TEXT: "La actividad para que otros tengan una referencia.",
                LEARN_MORE: "Aprende más sobre cómo funciona nuestro sistema de invitaciones"

            });
        }

        function _activate(){
            _setStrings();
            vm.categories = generalInfo.categories;
            console.log(student);
            console.log(vm.referrer);
        }

    }
})();
