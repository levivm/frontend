(function () {
    'use strict';

    angular
        .module('trulii.activities.controllers')
        .controller('ActivityEnrollSuccessController', ActivityEnrollSuccessController);

    ActivityEnrollSuccessController.$inject = ['$state', '$stateParams', 'activity', 'calendar', 'organizerActivities'];

    function ActivityEnrollSuccessController($state, $stateParams, activity, calendar, organizerActivities) {

        var vm = this;
        vm.activity = activity;
        vm.calendar = calendar;
        vm.organizer = activity.organizer;
        vm.organizerActivities = [];

        _activate();

        function _getOrganizerActivities() {
            return _.without(organizerActivities, activity).slice(0, 2);
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

        function _setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }
            angular.extend(vm.strings, {
                COPY_CONGRATULATIONS: "¡Felicidades!",
                COPY_PREPARE_TO_ASSIST_TO: "Prepárate para asistir a:",
                COPY_ASSISTANCE: "Aprender algo nuevo siempre es más divertido si lo compartes con tus amigos. "
                    + "¡Invítalos y disfruta el doble! Ellos también asistirán",
                COPY_ACTIVITIES_FROM: "Actividades de ",
                COPY_NO_ACTIVITIES: "El Organizador no tiene más Actividades disponibles",
                COPY_PUBLISH: "¿Te interesa organizar tu propia clase, curso o diplomado? "
                    + "Publica tu actividad con nosotros y comienza a aumentar tus inscripciones. ¡Crece con nosotros!",
                ACTION_VIEW_PROFILE: "Ver Perfil",
                ACTION_CONTACT: "Contactar",
                ACTION_GO_TO_ACTIVITIES: "Ir a Mis Actividades",
                ACTION_VIEW_RECEIPT: "Ver Recibo",
                ACTION_VIEW_MORE: "Ver Más",
                ACTION_PUBLISH: "Publica Ya",
                LABEL_ORGANIZER: "Organizador",
                LABEL_ASSISTANTS: "Asistentes",
                LABEL_PUBLISH_ACTIVITY: "Publica tu Actividad"
            });
        }

        function _activate() {
            _setStrings();
            _setCurrentState();
            vm.organizerActivities = _getOrganizerActivities();
            console.log('vm.organizerActivities:', vm.organizerActivities);
        }
    }
})();