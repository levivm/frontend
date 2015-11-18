
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
        .controller('ReferralsHomeCtrl', ReferralsHomeCtrl);

    ReferralsHomeCtrl.$inject = ['referrerUrl', 'Referrals', 'Toast'];

    function ReferralsHomeCtrl(referrerUrl, Referrals, Toast) {

        var vm = this;
        angular.extend(vm, {
            showVideo: false,
            referrerUrl: referrerUrl,
            toggleVideoShow: toggleVideoShow,
            postInvite: postInvite
        });

        _activate();

        function toggleVideoShow(){
          vm.showVideo = !vm.showVideo;
        }

        function postInvite(){
            if(vm.emails){
                Referrals.postInvite(vm.emails).then(success, error);
            } else {
                Toast.warning("Por favor ingrese correos validos separados por comas");
            }

            function success(response){
                console.log('success invite:', response);
                Toast.success("Invitaciones enviadas exitosamente");
            }

            function error(response){
                console.log('error invite:', response);
            }
        }

        //--------- Internal Functions ---------//

        function _setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }

            angular.extend(vm.strings, {
                HEADER_TITLE_COPY: "¡Comparte tu pasión por aprender!",
                HEADER_TEXT_COPY: "Cuando un amigo se inscribe a una actividad paga de Trulii, ambos recibirán un cupón por COP 20.000. ¡Todos salen ganando!",
                HEADER_ACTION_REGISTER: "Regístrate",
                HEADER_ACTION_LOGIN: "Iniciar sesión para invitar a mis amigos",
                ACTION_SEND_INVITES: "Enviar invitación",
                SHARE_URL_COPY: "Comparte esta URL",
                SHARES_TITLE_COPY_1: "Tienes",
                SHARES_TITLE_COPY_2: "de cupones en actividades para gastar.",
                SHARES_TEXT_COPY: "Invita a más amigos e incentívalos a que se inscriban en una actividad. ¡Todos salen ganando!",
                SHARES_REGISTERED: "El código de tu cupón es",
                SHARES_EMAIL_CHECK: "Revisa tu correo electrónico",
                SHARES_NOT_REGISTERED:  "Se registró pero no se ha inscrito en ninguna actividad aún",
                SHARES_AVAILABLE: "Disponibles",
                ACTION_RESEND_INVITE: "Reenviar invitación",
                SHARES_PENDING: "Pendientes",
                SHARES_NOT_REGISTED_YET: "No se ha registrado aún",
                PLACEHOLDER_REFERRAL_EMAILS: "Ingresa correos electrónicos. Sepáralos entre sí con comas",
                TRULII_MANIA_TEXT: "Comparte la truliimanía por tus redes sociales o por correo electrónico.",
                TRULII_INVITED_TEXT: "Tus invitados recibirán un cupón por COP 20.000 para inscribirse en lo que quieran aprender.",
                TRULII_COUPON_TEXT: "Cuando tus invitados se inscriban a una actividad paga, tú recibirás un cupón por COP 20.000 también.",
                LEARN_MORE: "Aprende más sobre cómo funciona nuestro sistema de invitaciones"

            });
        }

        function _activate(){
            _setStrings();
        }

    }
})();
