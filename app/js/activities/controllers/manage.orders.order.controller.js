/**
 * @ngdoc controller
 * @name trulii.students.controllers.ActivityOrderCtrl
 * @description Handles Activity Order History Dashboard
 * @requires order
 */
(function () {
    'use strict';

    angular
        .module('trulii.activities.controllers')
        .controller('ActivityOrderCtrl', ActivityOrderCtrl);

    ActivityOrderCtrl.$inject = ['$modal', '$window', '$stateParams','Toast', 'organizer', 'order', 'serverConf'];

    function ActivityOrderCtrl($modal, $window, $stateParams, Toast, organizer, order, serverConf) {
        var vm = this;
        angular.extend(vm,{
            order: order,
            isOrganizer: true,
            previousState: null,
            printOrder: printOrder,
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

        function _setFeeAmount(){
            vm.feeAmount = vm.order.fee * vm.order.total_without_coupon;
        }

        function _setTotalMinusFee(){
            vm.totalAmount = vm.order.total_without_coupon - vm.feeAmount;
        }

        function _setStrings() {
            if (!vm.strings) { vm.strings = {}; }
            angular.extend(vm.strings, {
                ACTION_PRINT: "Imprimir",
                ACTION_GO_BACK: "Regresar",
                SECTION_HISTORY: "Historial de Compras",
                LABEL_ORDER: "Orden",
                LABEL_FREE: "GRATIS",
                LABEL_ACTIVITY: "Actividad",
                LABEL_BUYER: "Comprador",
                LABEL_PAYMENT_TYPE: "Forma de pago",
                LABEL_ORDER_CREATE_AT: "Realizado el día:",
                LABEL_TOTAL: "Total",
                LABEL_SUB_TOTAL: "Sub-Total",
                LABEL_COUPON: "Cupón",
                LABEL_ORDER_STATUS: "Estatus: ",
                LABEL_TRULII_FEE: "Comisión",
                HEADER_ASSISTANT: "Asistente",
                HEADER_EMAIL: "Correo",
                HEADER_PRICE: "Precio",
                HEADER_ORDER: "Orden",
                HEADER_FIRST_NAME: "Nombre",
                HEADER_LAST_NAME: "Apellido",
                HEADER_ASSISTANT_CODE: "Código"
            });
        }

        function _activate() {
            vm.previousState = $stateParams.previousState;
            if (!(vm.previousState.state)){
                vm.previousState = {
                    'state':'dash.activities-manage.orders',
                    'params':{
                        'activity_id':order.activity.id
                    }
                };
            }
            _setStrings();
            _setFeeAmount();
            _setTotalMinusFee();
            //console.log('order',order);
        }
    }
})();
