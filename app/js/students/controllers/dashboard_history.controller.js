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
                ACTION_REIMBURSE: "Solicitar Reembolso",
                ACTION_FIND_ACTIVITY: "Buscar Actividad",
                COPY_SEARCH: "Buscar por número de orden, pago, detalle, etc.",
                COPY_NOT_AVAILABLE: "No Disponible",
                COPY_NA : "N/A",
                COPY_START_DATE: "Fecha inicio: ",
                LABEL_SEARCH:"Revisa toda la informacion de tu orden de compra. "
                + "Puedes incluso solicitar el reembolso del monto total de la orden o el monto "
                + "correspondiente por cada asistente",
                LABEL_EMPTY_REIMBURSEMENT: "No has solicitado ningún rembolso por el momento. Mientras tanto, ¿por qué no te a nimas a aprender algo nuevo?",
                LABEL_EMPTY_ORDERS: "Hasta ahora no has realizado compras",
                COPY_EMPTY_ORDERS: "Parece ser el momento perfecto para que descubras una nueva pasión, aprendas un nuevo pasatiemo o mejores tu curriculo",
                TAB_ORDERS: "Compras",
                TAB_REIMBURSEMENTS: "Reembolsos",
                PLURALIZE_ASSISTANT: "{} asistente",
                PLURALIZE_ASSISTANTS: "{} asistentes",
                HEADER_ORDER: "Nro. orden",
                HEADER_ACTIVITY: "Actividad",
                HEADER_PAYMENT: "Pago",
                HEADER_DETAIL: "Detalle",
                HEADER_PURCHASE_DATE: "Fecha de compra",
                HEADER_REIMBURSEMENT_DATE: "Fecha de reembolso",
                HEADER_REIMBURSEMENT_TOTAL: "Monto reembolsado",
                HEADER_REIMBURSEMENT_STATUS: "Estado del reembolso",
                HEADER_TOTAL: "Monto"
            });
        }

        function activate() {
            setStrings();
            getOrders();
        }

    }

})();