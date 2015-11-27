/**
 * @ngdoc controller
 * @name trulii.students.controllers.StudentDashboardCtrl
 * @description Handles Student Dashboard Main Component
 * @requires ui.router.state.$state
 */

(function () {
    'use strict';

    angular
        .module('trulii.students.controllers')
        .controller('StudentDashboardCtrl', StudentDashboardCtrl);

    StudentDashboardCtrl.$inject = ['$state'];

    function StudentDashboardCtrl($state) {

        var vm = this;
        angular.extend(vm, {
            changeState : _changeState,
            isActive : isActive
        });

        _activate();

        //--------- Exposed Functions ---------//

        function isActive(stateStr){
            return $state.includes(stateStr);
        }

        //--------- Internal Functions ---------//

        function _changeState(newState) {
            $state.go(newState);
        }

        function setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }
            angular.extend(vm.strings, {
                SECTION_ACTIVITIES: "Actividades",
                SECTION_ACCOUNT: "Cuenta",
                SECTION_PROFILE: "Perfil",
                SECTION_HISTORY: "Transacciones"
            });
        }

        function _activate() {
            setStrings();
        }
    }

})();
