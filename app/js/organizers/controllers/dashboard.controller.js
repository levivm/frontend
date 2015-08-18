/**
 * @ngdoc controller
 * @name trulii.organizers.controllers.OrganizerDashboardCtrl
 * @description Handles Organizer Dashboard
 * @requires ui.router.state.$state
 */

(function () {
    'use strict';

    angular
        .module('trulii.organizers.controllers')
        .controller('OrganizerDashboardCtrl', OrganizerDashboardCtrl);

    OrganizerDashboardCtrl.$inject = ['$state'];
    function OrganizerDashboardCtrl($state) {

        var vm = this;
        vm.changeState = changeState;

        activate();

        function changeState(newState) {
            $state.go(newState);
        }

        function setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }
            angular.extend(vm.strings, {
                SECTION_ACTIVITIES: "Actividades",
                SECTION_ACCOUNT: "Cuenta",
                SECTION_PROFILE: "Mi Perfil",
                SECTION_HISTORY: "Historial de Ventas"
            });
        }

        function activate() {
            setStrings();
        }

    }

})();