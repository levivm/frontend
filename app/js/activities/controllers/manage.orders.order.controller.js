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

    ActivityOrderCtrl.$inject = ['$stateParams','order'];

    function ActivityOrderCtrl($stateParams,order) {

        var vm = this;

        angular.extend(vm,{
            order: order,
            previousState: null,
        });

        _activate();


        function _setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }
            angular.extend(vm.strings, {
                ACTION_REIMBURSE: "Solicitar Reembolso",
                ACTION_REIMBURSE_ORDER: "Reembolsar de Ordén",
                ACTION_GO_BACK: "Regresar",
                SECTION_HISTORY: "Historial de Compras",
                LABEL_ORDER: "Ordén",
                LABEL_ACTIVITY: "Actividad",
                LABEL_PAYMENT_TYPE: "Forma de pago",
                LABEL_ORDER_CREATE_AT: "Realizado el día:",
                LABEL_TOTAL: "Total",
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
            console.log('order',order);
        }

    }

})();
