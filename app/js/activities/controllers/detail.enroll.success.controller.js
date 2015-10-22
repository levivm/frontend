(function () {
    'use strict';

    angular
        .module('trulii.activities.controllers')
        .controller('ActivityEnrollSuccessController', ActivityEnrollSuccessController);

    ActivityEnrollSuccessController.$inject = ['$state', '$stateParams', 'LocationManager', 'activity', 'calendar', 'organizerActivities'];

    function ActivityEnrollSuccessController($state, $stateParams, LocationManager, activity, calendar, organizerActivities) {

        var vm = this;
        angular.extend(vm, {
            activity : null,
            calendar : calendar,
            organizer : activity.organizer,
            organizerActivities : []
        });

        _activate();

        function _getOrganizerActivities() {
            console.log('organizerActivities:', organizerActivities);
            console.log('organizerActivities:', _.without(organizerActivities, activity));
            //return _.without(organizerActivities, activity).slice(0, 2);
            return _.without(organizerActivities, activity);
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

        function _setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }
            angular.extend(vm.strings, {
                COPY_HEADER_TITLE: "¡Excelente! Te acabas de inscribir en",
                COPY_HEADER_DESCRIPTION: "Te hemos enviado un correo electrónico con toda la "
                    + "información referente a la inscripcion y el pago",
                LABEL_REMEMBER: "Recuerda que",
                LABEL_START_DATE: "Inicio",
                LABEL_LOCATION: "Ubicación",
                LABEL_QUESTIONS: "¿Dudas?",
                LABEL_REQUIREMENTS: "¿Qué debo llevar?",
                LABEL_ATTENDEES: "Asistentes",
                COPY_ASSISTANTS: "Estos son algunos de los asistentes a esta actividad. ¡Falta poco para conocerlos!",
                LABEL_SHARE: "¡En compañia se la pasa mejor!",
                COPY_SHARE: "Cuéntale a tus amigos sobre esta actividad",
                LABEL_SIMILAR: "Actividades similares",
                ACTION_GO_TO_ACTIVITIES: "Ir a Mis Actividades",
                ACTION_GO_BACK: "Regresar",
                ACTION_CONTACT_US: "Contactanos"
            });
        }

        function _activate() {
            _setStrings();
            _setCurrentState();
            activity = _setCity(activity);
            vm.activity = activity;
            vm.organizerActivities = _getOrganizerActivities();
            console.log('activity:', activity);
        }
    }
})();
