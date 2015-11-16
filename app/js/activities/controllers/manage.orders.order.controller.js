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

    ActivityOrderCtrl.$inject = ['$modal', '$stateParams','Toast', 'organizer', 'order'];

    function ActivityOrderCtrl($modal, $stateParams, Toast, organizer, order) {
        var vm = this;
        angular.extend(vm,{
            order: order,
            isOrganizer: true,
            previousState: null,
            requestAssistantRefund: requestAssistantRefund,
            requestOrderRefund: requestOrderRefund,
        });

        _activate();

        /*  EXPOSED FUNCTIONS     */
        function requestOrderRefund(orderId){
            var modalInstance = $modal.open({
                templateUrl : 'partials/commons/messages/confirm_request_refund.html',
                controller : 'ModalInstanceCtrl',
                controllerAs:'modal',
                size : 'lg'
            });

            modalInstance.result.then(function () {
                organizer.requestRefund(orderId,null).then(success,error);
            });

            function success(response){
                vm.order.lastest_refund = response;
            }
            function error(response){
                Toast.error(response.non_field_errors.pop());
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
                organizer.requestRefund(orderId,assistant.id).then(success,error);
            });

            function success(response){
                assistant.lastest_refund = response;
            }
            function error(response){
                Toast.error(response.non_field_errors.pop());
            }
        }

        function _setFeeAmount(){
            vm.feeAmount = vm.order.fee * vm.order.total;
        }

        function _setTotalMinusFee(){
            vm.totalAmount = vm.order.total - vm.feeAmount;
        }

        function _setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }
            angular.extend(vm.strings, {
                ACTION_REIMBURSE: "Solicitar Reembolso",
                ACTION_REIMBURSE_ORDER: "Reembolsar Orden",
                ACTION_GO_BACK: "Regresar",
                SECTION_HISTORY: "Historial de Compras",
                LABEL_ORDER: "Ordén",
                LABEL_ACTIVITY: "Actividad",
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
                HEADER_LAST_NAME: "Apellido"
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
            console.log('order',order);
        }
    }
})();
