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

    StudentHistoryOrderCtrl.$inject = ['$modal','$stateParams', 'Toast','student', 'order'];

    function StudentHistoryOrderCtrl($modal,$stateParams, Toast, student, order) {

        var vm = this;

        angular.extend(vm,{
            student: student,
            order: order,
            isStudent:true,
            previousState:null,
            requestingRefund: {},
            requestingOrderRefund: false,
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
                enableOrderRefundLoader();
                student.requestRefund(orderId,null).then(success,error)
                        .finally(disableOrderRefundLoader);
            });

            function success(response){
                vm.order.lastest_refund = response;
            }

            function error(response){
                Toast.error(response.non_field_errors.pop());
            }

            function enableOrderRefundLoader(assistantId){
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
                student.requestRefund(orderId,assistant.id).then(success,error).
                                finally(disableRefundLoader);
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


        /*  INTERNAL FUNCTIONS     */






        function _setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }
            angular.extend(vm.strings, {
                ACTION_REIMBURSE: "Solicitar Reembolso",
                ACTION_REIMBURSE_ORDER: "Reembolso de orden",
                ACTION_GO_BACK: "Regresar",
                COPY_COUPON_NOT_REFUND_TOOLTIP: "El cupón no es reembolsable",
                COPY_REFUND_REQUESTED_BY_OTHER: "El reembolso fue solicitado por el organizador",
                SECTION_HISTORY: "Historial de Compras",
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
                REFUND_APPROVED_STATUS: "Aprobado",
                HEADER_ASSISTANT: "Asistente",
                HEADER_EMAIL: "Correo",
                HEADER_PRICE: "Precio",
                HEADER_ORDER: "Orden",
                HEADER_FIRST_NAME: "Nombre",
                HEADER_LAST_NAME: "Apellido",

            });
        }

        function _activate() {
            vm.previousState = $stateParams.previousState;
            _setStrings();
            console.log('order',order);
        }

    }

})();
