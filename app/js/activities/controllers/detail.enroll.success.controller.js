(function () {
    'use strict';

    angular
        .module('trulii.activities.controllers')
        .controller('ActivityEnrollSuccessController', ActivityEnrollSuccessController);

    ActivityEnrollSuccessController.$inject = ['$state', '$stateParams', 'LocationManager', 'Toast', 'activity', 'calendar', 'organizerActivities',
                                                'serverConf'];

    function ActivityEnrollSuccessController($state, $stateParams, LocationManager, Toast, activity, calendar, organizerActivities,serverConf) {

        var vm = this;
        angular.extend(vm, {
            activity : null,
            calendar : calendar,
            organizer : activity.organizer,
            organizerActivities : [],
            orderId: $stateParams.order_id,
            showEmail: false,
            toggleEmailShow: toggleEmailShow,
            shareEmailForm: shareEmailForm
        });

        _activate();

        //--------- Exposed Functions ---------//

        function shareEmailForm(){
            if(!vm.formData.emails){
                Toast.warning(vm.strings.COPY_EMPTY_EMAIL);
                return;
            }

            if(!vm.formData.message){
                Toast.warning(vm.strings.COPY_EMPTY_MESSAGE);
                return;
            }

            activity.share(vm.formData).then(success, error);

            function success(response){
                Toast.success(vm.strings.COPY_SHARE_SUCCESS);
            }
            function error(error){
                Toast.error(vm.strings.COPY_SHARE_ERROR);
                console.log('Error sharing activity', error);
            }
        }

        function toggleEmailShow(){
          vm.showEmail = !vm.showEmail;
        }

        //--------- Internal Functions ---------//

        function _getOrganizerActivities() {
            console.log('organizerActivities:', organizerActivities);
            console.log('organizerActivities:', _.without(organizerActivities, activity));
            return _.without(organizerActivities.results, activity);
        }

        function _setCurrentState(){
            vm.current_state = {
                toState: {
                    state: $state.current.name,
                    params: $stateParams
                }
            };
            console.log('vm.current_state:', vm.current_state);
        }

        function _setCity(activity){
            if(activity.location && activity.location.city){
                activity.location.city = LocationManager.getCityById(activity.location.city);
            }
            return activity;
        }


        function _setSocialShare(){

            var share_url = $state.href('activities-detail', $state.params, {absolute: true});
            vm.social = {};
            angular.extend(vm.social, {
                FACEBOOK_SOCIAL_PROVIDER: 'facebook',
                FACEBOOK_API_KEY: serverConf.FACEBOOK_APP_KEY,
                FACEBOOK_SHARE_TYPE: "feed",
                FACEBOOK_SHARE_CAPTION: "Trulii.com | ¡Aprende lo que quieras en tu ciudad!",
                FACEBOOK_SHARE_TEXT: vm.activity.title,
                FACEBOOK_SHARE_MEDIA: vm.activity.main_photo,
                FACEBOOK_SHARE_DESCRIPTION: vm.activity.short_description,
                FACEBOOK_REDIRECT_URI: share_url,
                FACEBOOK_SHARE_URL: share_url,
                TWITTER_SOCIAL_PROVIDER: 'twitter',
                TWITTER_SHARE_ACCOUNT:'Trulii_',
                TWITTER_SHARE_TEXT:'Échale un vistazo a ' + vm.activity.title,
                TWITTER_SHARE_URL: share_url ,
                TWITTER_SHARE_HASHTAGS:vm.activity.tags.join(',')
            });
        }

        function _setStrings() {
            if (!vm.strings) { vm.strings = {}; }
            angular.extend(vm.strings, {
                COPY_HEADER_TITLE: "¡Excelente! Te acabas de inscribir en",
                COPY_HEADER_DESCRIPTION: "Te hemos enviado un correo electrónico con toda la "
                    + "información referente a la inscripción y el pago.",
                LABEL_REMEMBER: "Recuerda que",
                LABEL_START_DATE: "Inicio",
                LABEL_LOCATION: "Ubicación",
                LABEL_QUESTIONS: "¿Dudas?",
                LABEL_REQUIREMENTS: "¿Qué debo llevar?",
                LABEL_ANY_DOUBT: "Cualquier pregunta",
                COPY_VIEW_YOUR_ORDER: "También puedes revisar tu ordén aquí",
                LABEL_ATTENDEES: "Asistentes",
                COPY_ASSISTANTS: "Estos son algunos de los asistentes a esta actividad. ¡Falta poco para conocerlos!",
                LABEL_SHARE: "¡En compañía se la pasa mejor!",
                COPY_SHARE: "Cuéntale a tus amigos sobre esta actividad.",
                LABEL_SIMILAR: "Actividades similares",
                ACTION_GO_TO_ACTIVITIES: "Ir a Mis Actividades",
                ACTION_GO_BACK: "Regresar",
                ACTION_CONTACT_US: "Contáctanos",
                EMAIL_MODAL_HEADER: "Comparte vía correo electrónico",
                EMAIL_MODAL_SEND_TO_LABEL: "Enviar a:",
                EMAIL_MODAL_SEND_TO_PLACEHOLDER: "Ingresa correos electronicos. Sepáralos entre sí con comas",
                EMAIL_MODAL_MESSAGE_LABEL: "Escribe un mensaje:",
                EMAIL_MODAL_MESSAGE_PLACEHOLDER: "Hey, échale un vistazo a esta actividad en Trulii. ¡Sé que te encantará!",
                EMAIL_MODAL_SEND: "Enviar invitacion",
                COPY_SHARE_SUCCESS: "La Actividad fue compartida exitosamente",
                COPY_SHARE_ERROR: "Error compartiendo la actividad, por favor intenta de nuevo",
                COPY_EMPTY_EMAIL: "Por favor agrega al menos un email",
                COPY_EMPTY_MESSAGE: "Por favor agrega un mensaje"
            });
        }

        function _activate() {
            _setStrings();
            _setCurrentState();
            activity = _setCity(activity);
            vm.activity = activity;
            vm.organizerActivities = _getOrganizerActivities();
            vm.organizerActivities = vm.organizerActivities.slice(0, 3);
            console.log('activity:', activity);
            _setSocialShare();
        }
    }
})();
