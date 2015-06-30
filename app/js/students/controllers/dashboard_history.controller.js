/**
 * @ngdoc controller
 * @name trulii.students.controllers.StudentHistoryCtrl
 * @description Handles Student History Dashboard
 * @requires activities
 */

(function () {
    'use strict';

    angular
        .module('trulii.students.controllers')
        .controller('StudentHistoryCtrl', StudentHistoryCtrl);

    StudentHistoryCtrl.$inject = ['student'];

    function StudentHistoryCtrl(student) {

        var vm = this;
        vm.activities = null;
        vm.orders = [];
        vm.options = {
            actions: ["view"]
        };

        activate();

        function getOrders(){
            student.getOrders().then(success, error);

            function success(orders){
                vm.orders = orders;
            }
            function error(orders){
                console.log('Error retrieving Student Orders History');
            }
        }

        function setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }
            angular.extend(vm.strings, {
                ACTION_REIMBURSE: "Reembolsar",
                SECTION_HISTORY: "Historial de Compras",
                COPY_SEARCH: "Buscar por número de orden, pago, detalle, etc.",
                LABEL_SEARCH: "Buscar Ordenes",
                LABEL_EMPTY_ORDERS: "Hasta ahora no has realizado compras",
                COPY_EMPTY_ORDERS: "Parece ser el momento perfecto para que descubras una nueva pasión, aprendas un nuevo pasatiemo o mejores tu curriculo",
                TAB_ORDERS: "Compras",
                TAB_REIMBURSEMENTS: "Reembolsos"
            });
        }

        function activate() {
            setStrings();
            getOrders();
            //vm.orders = [{'name': 'Levi'}];
        }

    }

})();