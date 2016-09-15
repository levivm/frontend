/**
 * @ngdoc controller
 * @name trulii.activities.controllers.ActivityDetailEnrollController
 * @description Controller for Activity Detail Enroll Component. Handles
 * calendar sign ups and related payments.
 * @requires ui.router.state.$state
 * @requires ui.router.state.$stateParams
 * @requires activity
 * @requires calendar
 * @requires trulii.payments.services.Payments
 */

(function () {
    'use strict';

    angular
        .module('trulii.activities.controllers')
        .controller('ActivityEnrollPSEResponseController', ActivityEnrollPSEResponseController);

    ActivityEnrollPSEResponseController.$inject = ['$state', '$stateParams', 'activity', 'calendar', 'Payments', 'serverConf'];

    function ActivityEnrollPSEResponseController($state, $stateParams, activity, calendar, Payments, serverConf) {

        var vm = this;
        angular.extend(vm, {
            activity : activity,
            calendar : calendar,
            organizer : activity.organizer,
            organizerActivities : [],
            retryPayment : retryPayment,
            finishPayment : finishPayment,
            packageQuantity : $stateParams.package_quantity ? $stateParams.package_quantity : null,
            packageID : $stateParams.package_id ? $stateParams.package_id : null,
            getAmazonUrl: getAmazonUrl
        });

        console.log("Parent params",$state.params.pseResponseData);
        console.log("Parent params",$state);
        _activate();
        
        function getAmazonUrl(file){
            return  serverConf.s3URL + '/' +  file;
        }
        
        function retryPayment(){
            $state.go('^',{ activity_id: vm.activity.id, calendar_id: calendar.id, package_id: vm.packageID },{ reload: true});
        }

        function finishPayment(){
            $state.go('activities-enroll-success',{ activity_id: vm.activity.id, calendar_id: calendar.id, package_quantity: vm.packageQuantity }, { reload: true });
        }

        function _checkPreviousState(){
            var from_enroll = _.endsWith($state.previous.name, 'activities-enroll');
            var from_success_enroll = _.endsWith($state.previous.name, 'success');

            if (from_enroll || from_success_enroll){ $state.reload(); }
        }

        function _setCurrentState(){
            vm.current_state = {
                toState: {
                    state: $state.current.name,
                    params: $stateParams
                }
            };
            console.log('vm.current_state:', vm.current_state);
        }

        function _setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }
            angular.extend(vm.strings, {
                COPY_PAYMENT_INFO: "Información de pago PSE",
                COPY_PREPARE_TO_ASSIST_TO: "Prepárate para asistir a:",
                COPY_ASSISTANCE: "Aprender algo nuevo siempre es más divertido si lo compartes con tus amigos. "
                    + "¡Invítalos y disfruta el doble! Ellos también asistirán",
                COPY_ACTIVITIES_FROM: "Actividades de ",
                COPY_NO_ACTIVITIES: "El Organizador no tiene más Actividades disponibles",
                COPY_PUBLISH: "¿Te interesa organizar tu propia clase, curso o diplomado? "
                    + "Publica tu actividad con nosotros y comienza a aumentar tus inscripciones. ¡Crece con nosotros!",
                ACTION_VIEW_PROFILE: "Ver Perfil",
                ACTION_CONTACT: "Contactar",
                ACTION_GO_TO_ACTIVITIES: "Ir a Mis Actividades",
                ACTION_VIEW_RECEIPT: "Ver Recibo",
                ACTION_VIEW_MORE: "Ver Más",
                ACTION_RETRY_PAYMENT: "Reintentar el pago",
                ACTION_FINISH_PAYMENT: "Continuar",
                ACTION_PUBLISH: "Publica Ya",
                LABEL_ORGANIZER: "Organizador",
                LABEL_ASSISTANTS: "Asistentes",
                LABEL_PUBLISH_ACTIVITY: "Publica tu Actividad",
                LABEL_OPEN_ACTIVITY: "Horario abierto",
                LABEL_PACKAGE: "Paquete",
                LABEL_CLASSES: "Clases",
                LABEL_SCHEDULES: "Horarios",
            });
        }

        function _setPSEData(){

            var params = $state.params;
            var pseData  =[
                {
                    name:  'Empresa',
                    value: params.merchant_name
                },
                {
                    name:  'NIT',
                    value: params.pseReference3
                },
                {
                    name:  'Estado',
                    value: params.state
                },
                {
                    name:  'Referencia de Pedido',
                    value: params.referenceCode
                },
                {
                    name:  'Referencia de Transacción',
                    value: params.transactionId
                },
                {
                    name:  'Numero de transacción',
                    value: params.cus
                },
                {
                    name:  'Banco',
                    value: params.pseBank
                },
                {
                    name:  'Valor',
                    value: params.TX_VALUE
                },
                {
                    name:  'Moneda',
                    value: params.currency
                },
                {
                    name:  'Descripción',
                    value: params.description
                },
                {
                    name:  'IP de Origin',
                    value: params.pseReference1
                }

            ];
            vm.pseData = pseData;
        }

        function _activate() {
            _setStrings();
            _setCurrentState();
            _setPSEData();
            _checkPreviousState();
            var declined_status = Payments.KEY_PSE_REJECTED_PAYMENT;
            var failed_status = Payments.KEY_PSE_FAILED_PAYMENT;
            vm.paymentDeclined = _.endsWith($state.params.state, declined_status)
                || _.endsWith($state.params.state, failed_status);
        }
    }
})();
