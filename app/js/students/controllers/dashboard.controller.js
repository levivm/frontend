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
        vm.changeState = _changeState;

        function _changeState(newState) {
            $state.go(newState);
        }

    }

})();