/**
 * @ngdoc controller
 * @name trulii.students.controllers.StudentHistoryOrderCtrl
 * @description Handles Student Orders History Dashboard
 * @requires student
 * @requires order
 */
(function () {
    'use strict';

    angular
        .module('trulii.students.controllers')
        .controller('StudentHistoryOrderCtrl', StudentHistoryOrderCtrl);

    StudentHistoryOrderCtrl.$inject = ['$stateParams','student', 'order'];

    function StudentHistoryOrderCtrl($stateParams,student, order) {

        var vm = this;

        angular.extend(vm,{
            student: student,
            order: order,
            previousState:null,
        });

        _activate();


        function _setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }
            angular.extend(vm.strings, {
                ACTION_REIMBURSE: "Solicitar Reembolso",
                ACTION_REIMBURSE_ORDER: "Reembolsar de Ordén",
                ACTION_GO_BACK: "Regresar",
                SECTION_HISTORY: "Historial de Compras",
                LABEL_ORDER: "Ordén",
                LABEL_ACTIVITY: "Actividad",
                LABEL_PAYMENT_TYPE: "Forma de pago",
                LABEL_ORDER_CREATE_AT: "Realizado el día:",
                LABEL_TOTAL: "Total",
                HEADER_ASSISTANT: "Asistente",
                HEADER_EMAIL: "Correo",
                HEADER_PRICE: "Precio",
                HEADER_ORDER: "Orden",
                HEADER_FIRST_NAME: "Nombre",
                HEADER_LAST_NAME: "Apellido"
            });
        }

        function _activate() {
            vm.previousState = $stateParams.previousState;
            _setStrings();
            console.log('order',order);
        }

    }

})();
