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

    StudentHistoryCtrl.$inject = ['$filter','student'];

    function StudentHistoryCtrl($filter,student) {

        var vm = this;
        angular.extend(vm,{
            activities: null,
            options: {actions: ['view']},
            updateByQuery:updateByQuery,
            pageChange: pageChange,
            queries : {
                orderQuery : null,
                assistantQuery : null
            },
            orderPaginationOpts: {
                totalItems: 0,
                itemsPerPage: 15,
                pageNumber: 1
            },
            refundsPaginationOpts: {
                totalItems: 0,
                itemsPerPage: 10,
                pageNumber: 1
            },
            TYPE_ORDER: 'order',
            TYPE_REFUNDS: 'refunds',


        });

        activate();

        var orders = [];
        var refunds = [];


        /*      Exposed Functions      */ 

        function updateByQuery(type){
            switch(type){
                case vm.TYPE_ORDER:
                    vm.orders = $filter('filter')(orders, vm.queries.orderQuery);
                    vm.orderPaginationOpts.totalItems = vm.orders.length;
                    vm.orderPaginationOpts.pageNumber = 1;
                    vm.orders = vm.orders.slice(0, vm.orderPaginationOpts.itemsPerPage);
                    console.log('Orders query order ',vm.orders);
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
                case vm.TYPE_ORDER:
                    offset = vm.orderPaginationOpts.itemsPerPage;
                    start = (vm.orderPaginationOpts.pageNumber -1) * offset;
                    end = vm.orderPaginationOpts.pageNumber * offset;
                    vm.orders = orders.slice(start, end);
                    break;
                case vm.TYPE_REFUNDS:
                    offset = vm.refundsPaginationOpts.itemsPerPage;
                    start = (vm.refundsPaginationOpts.pageNumber -1) * offset;
                    end = vm.refundsPaginationOpts.pageNumber * offset;
                    vm.refunds = refunds.slice(start, end);
                    break;
            }
        }

        /*       Internal Functions      */

        function _getOrders(){
            student.getOrders().then(success, error);

            function success(ordersResponse){
                orders = $filter('orderBy')(ordersResponse, 'id', true);
                vm.orderPaginationOpts.totalItems = orders.length;
                vm.orders = orders.slice(0, vm.orderPaginationOpts.itemsPerPage);

            }
            function error(orders){
                console.log('Error retrieving Student Orders History');
            }

        }

        function _getRefunds(){
            student.getRefunds().then(success,error);

            function success(data){

                refunds = $filter('orderBy')(data, 'order', true);
                console.log('refunds',refunds);
                vm.refundsPaginationOpts.totalItems = refunds.length;
                vm.refunds = refunds.slice(0, vm.refundsPaginationOpts.itemsPerPage);
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
                ACTION_REIMBURSE: "Solicitar Reembolso",
                ACTION_FIND_ACTIVITY: "Buscar Actividad",
                COPY_SEARCH: "Buscar por número de orden, pago, asistente, etc.",
                COPY_NOT_AVAILABLE: "No Disponible",
                COPY_NA : "N/A",
                COPY_START_DATE: "Fecha inicio: ",
                LABEL_SEARCH:"Revisa toda la informacion de tu orden de compra. "
                + "Puedes incluso solicitar el reembolso del monto total de la orden o el monto "
                + "correspondiente por cada asistente",
                LABEL_EMPTY_REFUND: "No has solicitado ningún rembolso por el momento. Mientras tanto, ¿por qué no te a nimas a aprender algo nuevo?",
                LABEL_EMPTY_ORDERS: "No te has inscrito en ninguna actividad aún. Eso nos parte el corazón. ¿Por qué no te animas hoy a aprender lo que te apasiona?",
                LABEL_EVERYBODY: "Todos",
                COPY_EMPTY_ORDERS: "Parece ser el momento perfecto para que descubras una nueva pasión, aprendas un nuevo pasatiemo o mejores tu curriculo",
                TAB_ORDERS: "Compras",
                TAB_REFUNDS: "Reembolsos",
                PLURALIZE_ASSISTANT: "{} asistente",
                PLURALIZE_ASSISTANTS: "{} asistentes",
                HEADER_ORDER: "Orden",
                HEADER_ACTIVITY: "Actividad",
                HEADER_PAYMENT: "Pago",
                HEADER_DETAIL: "Detalle",
                HEADER_STATUS: "Estatus",
                HEADER_ASSISTANT: "Asistente",
                HEADER_PURCHASE_DATE: "Fecha de compra",
                HEADER_REFUND_DATE: "Fecha de reembolso",
                HEADER_REFUND_TOTAL: "Monto",
                HEADER_REFUND_STATUS: "Estado",
                HEADER_TOTAL: "Monto"
            });
        }

        function activate() {
            _setStrings();
            _getOrders();
            _getRefunds();
        }

    }

})();