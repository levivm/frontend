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

    OrganizerTransactionsCtrl.$inject = ['$filter','organizer'];
    function OrganizerTransactionsCtrl($filter,organizer) {

        var vm = this;

        angular.extend(vm,{

        organizer: organizer,
        password_data: {},
        isCollapsed: true,
        isSaving: false,
        sales: [],
        reimbursements: [],
        queries : {
            saleQuery : null,
        },
        salesPaginationOpts: {
            totalItems: 0,
            itemsPerPage: 10,
            pageNumber: 1
        },
        pageChange:pageChange,
        updateByQuery:updateByQuery,
        TYPE_SALES: 'sales',


        });

        _activate();
        var sales = [];

        /*         EXPOSED FUNCTIONS       */
        function updateByQuery(type){
            switch(type){
                case vm.TYPE_SALES:
                console.log('updating',vm.queries.saleQuery);
                    vm.sales = $filter('filter')(sales, vm.queries.saleQuery);
                    vm.salesPaginationOpts.totalItems = vm.sales.length;
                    vm.salesPaginationOpts.pageNumber = 1;
                    vm.sales = vm.sales.slice(0, vm.salesPaginationOpts.itemsPerPage);
                    break;
            }
        }

        function pageChange(type){
            var offset = null;
            var start = null;
            var end = null;
            switch(type){
                case vm.TYPE_SALES:
                    offset = vm.salesPaginationOpts.itemsPerPage;
                    start = (vm.salesPaginationOpts.pageNumber -1) * offset;
                    end = vm.salesPaginationOpts.pageNumber * offset;
                    vm.sales = sales.slice(start, end);
                    console.log('sales:', vm.sales);
                    break;
            }
        }


        //Private functions

        function _getOrders(){
            organizer.getOrders().then(success, error);

            function success(orders){
                // vm.sales = orders;
                sales = $filter('orderBy')(orders, 'id', true);
                vm.salesPaginationOpts.totalItems = sales.length;
                vm.sales = sales.slice(0, vm.salesPaginationOpts.itemsPerPage);
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
                COPY_START_DATE : "Fecha de inicio:",
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
                LABEL_DATE: "Fecha de venta",
                LABEL_TOTAL: "Total Ventas",
                LABEL_FINAL_TOTAL: "Ventas Netas",
                LABEL_NO_ORDERS: "No hay ordenes en el historial",
                LABEL_NO_REIMBURSEMENTS: "No hay reembolsos en el historial",
            });
        }

        function _activate() {
            _setStrings();
            _getOrders();
            console.log('organizer:', organizer);
        }

    }

})();
