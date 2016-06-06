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

    StudentHistoryOrderCtrl.$inject = ['$modal', '$window', '$stateParams', 'Toast','student', 'order', 'Analytics', 'serverConf'];

    function StudentHistoryOrderCtrl($modal, $window, $stateParams, Toast, student, order, Analytics, serverConf) {

        var vm = this;
        angular.extend(vm,{
            student: student,
            order: order,
            isStudent:true,
            previousState:null,
            printOrder: printOrder,
            salesPaginationOpts: {
                totalItems: 0,
                itemsPerPage: 10,
                maxPagesSize:10,
                pageNumber: 1
            },
            getAmazonUrl: getAmazonUrl
        });

        _activate();

        //--------- Exposed Functions ---------//
        
        function getAmazonUrl(file){
            return  serverConf.s3URL + '/' +  file;
        }

        function printOrder(){
            $window.print();
        }




        //--------- Internal Functions ---------//

        function _setStrings() {
            if (!vm.strings) { vm.strings = {}; }
            angular.extend(vm.strings, {
                ACTION_GO_BACK: "Regresar",
                ACTION_PRINT: "Imprimir",
                COPY_ASSISTANT_CODE_TOOLTIP: "Este código es único y ayuda a identificar a un asistente",
                SECTION_HISTORY: "Historial de Compras",
                LABEL_ORDER: "Nro. de Orden",
                LABEL_FREE: "GRATIS",
                LABEL_ACTIVITY: "Actividad",
                LABEL_BUYER: "Comprador",
                LABEL_PAYMENT_TYPE: "Forma de pago",
                LABEL_ORDER_CREATE_AT: "Realizado el día:",
                LABEL_TOTAL: "Total",
                LABEL_SUB_TOTAL: "Sub-Total",
                LABEL_COUPON: "Cupón",
                LABEL_ORDER_STATUS: "Estatus: ",
                HEADER_ASSISTANT: "Asistente",
                HEADER_EMAIL: "Correo",
                HEADER_PRICE: "Precio",
                HEADER_ORDER: "Orden",
                HEADER_FIRST_NAME: "Nombre",
                HEADER_LAST_NAME: "Apellido",
                HEADER_ASSISTANT_CODE: "Código",
                TAB_ORDER: "Transacción > Orden de compra"
            });
        }

        function _activate() {
            vm.previousState = $stateParams.previousState;
            _setStrings();
            console.log('order',order);
        }
    }
})();
