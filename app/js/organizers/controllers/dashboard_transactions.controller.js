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

    OrganizerTransactionsCtrl.$inject = ['$filter', 'organizer', 'orders', 'refunds'];
    function OrganizerTransactionsCtrl($filter, organizer, orders, refunds) {

        var vm = this;

        angular.extend(vm, {
            organizer: organizer,
            password_data: {},
            isCollapsed: true,
            isSaving: false,
            sales: [],
            refunds: [],
            reimbursements: [],
            queries : {
                saleQuery : null,
                refundQuery : null
            },
            salesPaginationOpts: {
                totalItems: 0,
                itemsPerPage: 10,
                maxPagesSize:10,
                pageNumber: 1
            },
            refundsPaginationOpts: {
                totalItems: 0,
                itemsPerPage: 10,
                maxPagesSize:10,
                pageNumber: 1
            },
            pageChange:pageChange,
            updateByQuery:updateByQuery,
            TYPE_SALES: 'sales',
            TYPE_REFUNDS: 'refunds'
        });

        _activate();
        var sales = orders;

        //--------- Exposed Functions ---------//

        function updateByQuery(type){
            switch(type){
                case vm.TYPE_SALES:
                console.log('updating',vm.queries.saleQuery);
                    vm.sales = $filter('filter')(sales, vm.queries.saleQuery);
                    vm.salesPaginationOpts.totalItems = vm.sales.length;
                    vm.salesPaginationOpts.pageNumber = 1;
                    vm.sales = vm.sales.slice(0, vm.salesPaginationOpts.itemsPerPage);
                    break;
                case vm.TYPE_REFUNDS:
                console.log('updating',vm.queries.refundQuery);
                    vm.refunds = $filter('filter')(refunds, vm.queries.refundQuery);
                    vm.refundsPaginationOpts.totalItems = vm.refunds.length;
                    vm.refundsPaginationOpts.pageNumber = 1;
                    vm.refunds = vm.refunds.slice(0, vm.refundsPaginationOpts.itemsPerPage);
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
                case vm.TYPE_REFUNDS:
                    offset = vm.refundsPaginationOpts.itemsPerPage;
                    start = (vm.refundsPaginationOpts.pageNumber -1) * offset;
                    end = vm.refundsPaginationOpts.pageNumber * offset;
                    vm.refunds = refunds.slice(start, end);
                    break;
            }
        }

        //--------- Internal Functions ---------//

        function _getOrders(){
            sales = $filter('orderBy')(orders, 'id', true);
            vm.salesPaginationOpts.totalItems = sales.length;
            vm.sales = sales.slice(0, vm.salesPaginationOpts.itemsPerPage);
        }

        function _getRefunds(){
            refunds = $filter('orderBy')(refunds, 'id', true);
            vm.refundsPaginationOpts.totalItems = refunds.length;
            vm.refunds = refunds.slice(0, vm.refundsPaginationOpts.itemsPerPage);
        }

        function _setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }

            angular.extend(vm.strings, {
                ACTION_REIMBURSE: "Reembolsar",
                ACTION_VIEW_DETAIL: "Ver detalle",
                COPY_EMAIL: "¿Desea cambiar su correo electrónico?",
                COPY_NOT_AVAILABLE : "No Disponible",
                COPY_NA : "N/A",
                COPY_START_DATE : "Fecha de inicio:",
                COPY_SEARCH_ORDERS_HELPER : "Buscar por número de orden, pago, asistente, etc.",
                COPY_NO_ORDERS: "Aún no tienes ordenes en tu historial de Ventas",
                COPY_NO_REIMBURSEMENTS: "Aún no tienes reembolsos en tu historial de Ventas",
                COPY_FINAL_TOTAL_SALES_TOOLTIP: "Este es el monto de venta restando la comisión de Trulii, consulte el detalle "+
                                          "para mayor información",
                COPY_TOTAL_SALES_TOOLTIP: "Este es el monto total de la orden sin contar la comisión de Trulii",
                TAB_SALES: "Ventas",
                TAB_REFUNDS: "Reembolsos",
                LABEL_SEARCH_ORDERS : "Buscar Ordenes",
                LABEL_ORDER: "Orden",
                LABEL_ACTIVITY: "Actividad",
                LABEL_PAYMENT: "Pago",
                LABEL_DETAIL: "Detalle",
                LABEL_DATE: "Fecha de venta",
                LABEL_REFUND_DATE: "Fecha de Reembolso",
                LABEL_REFUND_AMOUNT: "Monto",
                LABEL_REFUND_STATE: "Estado",
                LABEL_ASSISTANT: "Asistente",
                LABEL_TOTAL: "Total Ventas",
                LABEL_EVERYBODY: "Todos",
                LABEL_FINAL_TOTAL: "Ventas Netas",
                LABEL_NO_ORDERS: "No hay ordenes en el historial",
                LABEL_NO_REIMBURSEMENTS: "No hay reembolsos en el historial",
            });
        }

        function _activate() {
            _setStrings();
            _getOrders();
            _getRefunds();
            console.log('organizer:', organizer);
        }

    }

})();
