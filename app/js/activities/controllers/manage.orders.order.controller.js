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

    ActivityOrderCtrl.$inject = ['$modal', '$state', '$window', '$stateParams','Toast', 'organizer', 'order', 'serverConf', 'bankingData'];

    function ActivityOrderCtrl($modal, $state, $window, $stateParams, Toast, organizer, order, serverConf, bankingData) {
        var vm = this;
        angular.extend(vm,{
            order: order,
            isOrganizer: true,
            previousState: null,
            printOrder: printOrder,
            getAmazonUrl: getAmazonUrl,
            goBack:goBack,
            organizer: organizer,
            bankingData: bankingData
        });

        _activate();

        //--------- Exposed Functions ---------//
        
        function getAmazonUrl(file){
            return  serverConf.s3URL + '/' +  file;
        }

        function printOrder(){
            $window.print();
        }

        function goBack() {
            var previousState =  $state.previous.name ? $state.previous.name:$state.previous.url ;
            $state.go(previousState, {});
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
                LABEL_TOTAL: "Total ",
                LABEL_SUB_TOTAL: "Sub-Total",
                LABEL_COUPON: "Cupón",
                LABEL_ORDER_STATUS: "Estatus: ",
                LABEL_TRULII_FEE: "Comisión Total",
                HEADER_ASSISTANT: "Asistente",
                HEADER_EMAIL: "Correo",
                HEADER_PRICE: "Precio",
                HEADER_ORDER: "Orden",
                HEADER_FIRST_NAME: "Nombre",
                HEADER_LAST_NAME: "Apellido",
                HEADER_ASSISTANT_CODE: "Código",
                COPY_PRINT_TRULII_TITLE: "Truli S.A.S",
                COPY_PRINT_IVA_TITLE: "I.V.A Régimen Común",
                OPY_PRINT_TEL: "Tel:57(1) 308.80.29",
                COPY_PRINT_ADDRESS: "CL 127 Bus # 19-57 INT 5",
                COPY_PRINT_CITY: "Bogota D.C Colombia",
                COPY_PRINT_EMAIL: "alo@trulii.com",
                COPY_PRINT_ORDER_NUM: "Factura de Venta N°",
                COPY_PRINT_INFO1: "No somos grandes contribuyentes",
                COPY_PRINT_INFO2: "No somos autoretenedores",
                COPY_PRINT_INFO3: "Actividad economica 4791 tarifa ICA 11.01 por Mil",
                LABEL_PRINT_CANT: "Cantidad",
                LABEL_PRINT_DETAIL: "Detalle y/o Concepto del Servicio",
                LABEL_PRINT_PRICE_UN: "Costo Unitario COP $",
                LABEL_PRICE_TOTAL: "Costo Total COP $"
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
            vm.fullAddress = vm.bankingData.person_type == 2 ? vm.bankingData.fiscal_address : vm.organizer.location.address; 
            vm.addressPhone = vm.bankingData.person_type == 2 ? vm.bankingData.billing_telephone : vm.organizer.telephone; 
        }
    }
})();
