
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
        .controller('ReferralsAnonCtrl', ReferralsAnonCtrl);

    ReferralsAnonCtrl.$inject = ['$state', 'serverConf'];

    function ReferralsAnonCtrl($state, serverConf) {

        var vm = this;
        angular.extend(vm, {
            showVideo: false,
            stateInfo : {
                toState: {
                    state: 'referrals.home'
                }
            },
            toggleVideoShow: toggleVideoShow,
            goToLogin: goToLogin,
            getAmazonUrl: getAmazonUrl
        });

        _activate();

        //--------- Exposed Functions ---------//
        
        function getAmazonUrl(file){
            return  serverConf.s3URL + '/' +  file;
        }

        function toggleVideoShow(){
          vm.showVideo = !vm.showVideo;
        }

        function goToLogin(){
            $state.go('login', vm.stateInfo);
        }

        //--------- Internal Functions ---------//

        function _setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }

            angular.extend(vm.strings, {
                HEADER_TITLE_COPY: "¡Gana cupones de COP 20.000 para cualquier actividad por cada amigo que invites!",
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
                LEARN_MORE: "Aprende más sobre cómo funciona nuestro sistema de invitaciones"
            });
        }

        function _activate(){
            _setStrings();
        }

    }
})();
