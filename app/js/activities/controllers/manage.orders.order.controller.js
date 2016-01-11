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

    ActivityOrderCtrl.$inject = ['$modal', '$window', '$stateParams','Toast', 'organizer', 'order'];

    function ActivityOrderCtrl($modal, $window, $stateParams, Toast, organizer, order) {
        var vm = this;
        angular.extend(vm,{
            order: order,
            isOrganizer: true,
            previousState: null,
            requestingRefund: {},
            requestingOrderRefund: false,
            requestAssistantRefund: requestAssistantRefund,
            requestOrderRefund: requestOrderRefund,
            printOrder: printOrder
        });

        _activate();

        //--------- Exposed Functions ---------//

        function printOrder(){
            $window.print();
        }

        function requestOrderRefund(orderId){
            var modalInstance = $modal.open({
                templateUrl : 'partials/commons/messages/confirm_request_refund.html',
                controller : 'ModalInstanceCtrl',
                controllerAs:'modal',
                size : 'lg'
            });

            modalInstance.result.then(function () {
                enableOrderRefundLoader();
                organizer.requestRefund(orderId,null).then(success,error)
                                .finally(disableOrderRefundLoader);
            });

            function success(response){
                vm.order.lastest_refund = response;
            }
            function error(response){
                Toast.error(response.non_field_errors.pop());
            }

            function enableOrderRefundLoader(){
                vm.requestingOrderRefund = true;
            }

            function disableOrderRefundLoader(){
                vm.requestingOrderRefund = false;
            }
        }

        function requestAssistantRefund(orderId,assistant){
            var modalInstance = $modal.open({
                templateUrl : 'partials/commons/messages/confirm_request_refund.html',
                controller : 'ModalInstanceCtrl',
                controllerAs:'modal',
                size : 'lg'
            });

            modalInstance.result.then(function () {
                enableRefundLoader(assistant.id);
                organizer.requestRefund(orderId,assistant.id).then(success,error)
                            .finally(disableRefundLoader);
            });

            function success(response){
                assistant.lastest_refund = response;
            }

            function error(response){
                Toast.error(response.non_field_errors.pop());
            }

            function enableRefundLoader(assistantId){
                vm.requestingRefund[assistantId] = true;
                vm.currentAssistantLoader = assistantId;
            }

            function disableRefundLoader(){
                vm.requestingRefund[vm.currentAssistantLoader] = false;
            }
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
                ACTION_REIMBURSE: "Solicitar Reembolso",
                ACTION_REIMBURSE_ORDER: "Reembolsar Orden",
                ACTION_PRINT: "Imprimir",
                ACTION_GO_BACK: "Regresar",
                SECTION_HISTORY: "Historial de Compras",
                COPY_REFUND_REQUESTED_BY_OTHER: "El reembolso fue solicitado por el estudiante",
                LABEL_ORDER: "Ordén",
                LABEL_FREE: "GRATIS",
                LABEL_ACTIVITY: "Actividad",
                LABEL_BUYER: "Comprador",
                LABEL_PAYMENT_TYPE: "Forma de pago",
                LABEL_ORDER_CREATE_AT: "Realizado el día:",
                LABEL_TOTAL: "Total",
                LABEL_SUB_TOTAL: "Sub-Total",
                LABEL_REIMBURSEMENTS: "Reembolsos",
                LABEL_COUPON: "Cupón",
                LABEL_ORDER_STATUS: "Estatus: ",
                LABEL_REIMBURSEMENTS_STATUS: "Estatus reembolso:",
                LABEL_TRULII_FEE: "Comisión",
                REFUND_APPROVED_STATUS: "Aprobado",
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
                        'activity_id':order.activity_id
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
