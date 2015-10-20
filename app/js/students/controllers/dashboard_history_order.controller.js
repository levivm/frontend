/**
 * @ngdoc controller
 * @name trulii.students.controllers.StudentHistoryOrderCtrl
 * @description Handles Student Order History Dashboard
 * @requires student
 * @requires order
 */

(function () {
    'use strict';

    angular
        .module('trulii.students.controllers')
        .controller('StudentHistoryOrderCtrl', StudentHistoryOrderCtrl);

    StudentHistoryOrderCtrl.$inject = ['student', 'order'];

    function StudentHistoryOrderCtrl(student, order) {

        var vm = this;
        vm.student = null;
        vm.order = null;

        _activate();


        function _setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }
            angular.extend(vm.strings, {
                ACTION_REIMBURSE: "Solicitar Reembolso",
                SECTION_HISTORY: "Historial de Compras"
            });
        }

        function _activate() {
            _setStrings();
            vm.student = student;
            vm.order = order;
        }

    }

})();
