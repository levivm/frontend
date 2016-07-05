
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

    ReferralsHomeCtrl.$inject = ['referrerUrl', 'Referrals', 'Toast', 'serverConf', 'student', 'Analytics'];

    function ReferralsHomeCtrl(referrerUrl, Referrals, Toast, serverConf, student, Analytics) {

        var vm = this;
        angular.extend(vm, {
            showVideo: false,
            referrerUrl: referrerUrl,
            toggleVideoShow: toggleVideoShow,
            postInvite: postInvite,
            getAmazonUrl: getAmazonUrl
        });

        _activate();
        
        function getAmazonUrl(file){
            return  serverConf.s3URL + '/' +  file;
        }

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
                Analytics.studentEvents.sendReferral();
                Toast.success("Invitaciones enviadas exitosamente");
            }

            function error(response){
                console.log('error invite:', response);
            }
        }

        //--------- Internal Functions ---------//

        function _setSocialShare(){
            var shareText = "Regístrate y obtén un cupón por 20.000 COP para tu primera actividad";
            vm.social = {};
            angular.extend(vm.social, {
                FACEBOOK_SOCIAL_PROVIDER: 'facebook',
                FACEBOOK_API_KEY: serverConf.FACEBOOK_APP_KEY,
                FACEBOOK_SHARE_TYPE: "feed",
                FACEBOOK_SHARE_CAPTION: "Trulii.com | ¡Aprende lo que quieras en tu ciudad!",
                FACEBOOK_SHARE_TEXT: shareText,
                FACEBOOK_SHARE_MEDIA: "https://s3-us-west-2.amazonaws.com/trulii-dev/static/img/share.png",
                FACEBOOK_SHARE_DESCRIPTION: "Únete a " + student.user.first_name + " y encuentra e inscribete en"
                    + " las mejores actividades y eventos educativos de tu ciudad",
                FACEBOOK_REDIRECT_URI: referrerUrl,
                FACEBOOK_SHARE_URL: referrerUrl,
                TWITTER_SOCIAL_PROVIDER: 'twitter',
                TWITTER_SHARE_ACCOUNT:'Trulii_',
                TWITTER_SHARE_TEXT: shareText,
                TWITTER_SHARE_URL: referrerUrl
            });

            //console.log(vm.social.FACEBOOK_SHARE_DESCRIPTION);
        }

        function _setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }

            angular.extend(vm.strings, {
                COPY_SOCIAL_SHARE_FACEBOOK: "Compartir en Facebook",
                COPY_SOCIAL_SHARE_TWITTER: "Compartir en Twitter",
                HEADER_TITLE_COPY_1: "¡Comparte tu pasión",
                HEADER_TITLE_COPY_2: "por aprender!",
                HEADER_TEXT_COPY: "Invita a tus amigos a unirse a Trulii con un cupón de COP 20.000. Cuando se inscriban a una actividad, tú también recibiras un cupón. Todos salen ganando.",
                HEADER_ACTION_REGISTER: "Regístrate",
                HEADER_ACTION_LOGIN: "Iniciar sesión para invitar a mis amigos",
                ACTION_SEND_INVITES: "Enviar invitación",
                SHARE_URL_COPY: "Comparte esta URL",
                SHARES_TITLE_COPY_1: "Tienes",
                SHARES_TITLE_COPY_2: "en cupones para gastarlos en cualquier actividad.",
                SHARES_TEXT_COPY: "Invita a más amigos e incentívalos a que se inscriban en una actividad. ¡Todos salen ganando!",
                SHARES_REGISTERED: "El código de tu cupón es ",
                SHARES_EMAIL_CHECK: "Revisa tu correo electrónico",
                SHARES_NOT_REGISTERED: "se registró pero no se ha inscrito a ninguna actividad aún",
                SHARES_AVAILABLE: "Disponibles",
                SHARES_PENDING: "Pendientes",
                SHARES_NOT_REGISTERED_YET: " No se ha registrado aún.",
                ACTION_RESEND_INVITE: "Reenviar invitación",
                PLACEHOLDER_REFERRAL_EMAILS: "Ingresa correos electrónicos. Sepáralos entre sí con comas",
                TRULII_MANIA_TEXT: "Comparte la truliimanía por tus redes sociales o por correo electrónico.",
                TRULII_INVITED_TEXT: "Tus invitados recibirán un cupón por COP 20.000 para inscribirse en lo que quieran aprender.",
                TRULII_COUPON_TEXT: "Cuando tus invitados se inscriban a una actividad paga, tú recibirás un cupón por COP 20.000 también.",
                LEARN_MORE: "Aprende más sobre cómo funciona nuestro sistema de invitaciones"

            });
        }

        function _activate(){
            _setStrings();
            _setSocialShare();
        }

    }
})();
