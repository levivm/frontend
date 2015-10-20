/**
 * @ngdoc controller
 * @name trulii.organizers.controllers.OrganizerTransactionsCtrl
 * @description Handles Transactions section for Organizer Dashboard
 * @requires organizer
 */

(function () {
    'use strict';

    angular
        .module('trulii.organizers.controllers')
        .controller('OrganizerTransactionsCtrl', OrganizerTransactionsCtrl);

    OrganizerTransactionsCtrl.$inject = ['organizer'];
    function OrganizerTransactionsCtrl(organizer) {

        var vm = this;

        vm.organizer = organizer;
        vm.password_data = {};
        vm.isCollapsed = true;
        vm.isSaving = false;
        vm.sales = [];
        vm.reimbursements = [];

        _activate();

        //Private functions

        function _getOrders(){
            organizer.getOrders().then(success, error);

            function success(orders){
              vm.sales = orders;
                console.log("orders:", orders);
            }
            function error(data){
                console.log("Error getting Organizer's orders");
            }
        }

        function _setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }
            angular.extend(vm.strings, {
                ACTION_REIMBURSE: "Reembolsar",
                COPY_EMAIL: "¿Desea cambiar su correo electrónico?",
                COPY_NOT_AVAILABLE : "No Disponible",
                COPY_NA : "N/A",
                COPY_SEARCH_ORDERS_HELPER : "Buscar por número de orden, pago, detalle, etc.",
                COPY_NO_ORDERS: "Aún no tienes ordenes en tu historial de Ventas",
                COPY_NO_REIMBURSEMENTS: "Aún no tienes reembolsos en tu historial de Ventas",
                COPY_ONE_ASSISTANT: "1 asistente",
                COPY_MANY_ASSISTANTS: "{} asistentes",
                TAB_SALES: "Ventas",
                TAB_REIMBURSEMENTS: "Reembolsos",
                LABEL_SEARCH_ORDERS : "Buscar Ordenes",
                LABEL_ORDER: "Orden",
                LABEL_ACTIVITY: "Actividad",
                LABEL_PAYMENT: "Pago",
                LABEL_DETAIL: "Detalle",
                LABEL_DATE: "Fecha",
                LABEL_TOTAL: "Total",
                LABEL_NO_ORDERS: "No hay ordenes en el historial",
                LABEL_NO_REIMBURSEMENTS: "No hay reembolsos en el historial"
            });
        }

        function _activate() {
            _setStrings();
            _getOrders();
            console.log('organizer:', organizer);
        }

    }

})();
