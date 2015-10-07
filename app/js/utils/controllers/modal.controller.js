/**
 * ModalInstanceCtrl
 * @namespace thinkster.authentication.controllers
 */
    (function () {
        'use strict';

        angular
            .module('trulii.utils.controllers')
            .controller('ModalInstanceCtrl', function ($modalInstance, $state) {

                var vm = this;
                vm.strings = {};
                vm.strings.REQUEST_SIGNUP_TITLE = "Solicitud de Registro";
                vm.strings.REQUEST_SIGNUP_SUCCESS_MSG = "Su solicitud de registro fue procesada existosamente";
                vm.strings.REQUEST_SIGNUP_SUCCESS_MSG += ". Pronto le enviaremos un correo de confirmación";

                vm.ok = ok;
                vm.cancel = cancel;

                function ok () {
                    $modalInstance.close();
                }

                function cancel() {

                    $modalInstance.dismiss('cancel');
                }
            });


    })();