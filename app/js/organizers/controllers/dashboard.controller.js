/**
 * Register controller
 * @namespace thinkster.organizers.controllers
 */
(function () {
    'use strict';


    angular
        .module('trulii.organizers.controllers')
        .controller('OrganizerDashboardCtrl', OrganizerDashboardCtrl);

    OrganizerDashboardCtrl.$inject = ['$state'];
    /**
     * @namespace RegisterController
     */
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
                SECTION_PROFILE: "Mi Perfil"
            });
        }

        function activate() {
            setStrings();
        }

    }

})();