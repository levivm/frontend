/**
 * @ngdoc controller
 * @name trulii.organizers.controllers.OrganizerAccountCtrl
 * @description Handles Organizer Account Dashboard
 * @requires organizer
 */

(function () {
    'use strict';

    angular
        .module('trulii.organizers.controllers')
        .controller('OrganizerAccountCtrl', OrganizerAccountCtrl);

    OrganizerAccountCtrl.$inject = ['$location', '$timeout', '$state', 'Authentication', 'Error', 'organizer'];
    function OrganizerAccountCtrl($location, $timeout, $state, Authentication, Error, organizer) {

        var vm = this;

        vm.organizer = organizer;
        vm.password_data = {};
        vm.isCollapsed = true;
        vm.isSaving = false;
        vm.changeEmail = changeEmail;
        vm.changePassword = changePassword;

        activate();

        //Private functions

        function changeEmail() {
            vm.isSaving = true;
            Error.form.clear(vm.account_form_email);
            vm.organizer.change_email()
                .then(success, error);

            function success() {
                Authentication.updateAuthenticatedAccount();
                vm.isSaving = false;
            _toggleMessage();
        }

            function error(response) {
                vm.isSaving = false;
                var responseErrors = response.data['form_errors'];
                if (responseErrors) {
                    Error.form.add(vm.account_form_email, responseErrors);
                }
            }
        }

        function changePassword() {
            vm.isSaving = true;
            Error.form.clear(vm.account_form_password);
            vm.organizer.change_password(vm.password_data)
                .then(success, error);

            function success() {
                vm.isSaving = false;
            $state.go('general-message', {
                'module_name' : 'authentication',
                'template_name' : 'change_password_success',
                'redirect_state' : 'home'
            });
        }

            function error(response) {
                vm.isSaving = false;
                var responseErrors = response.data['form_errors'];
                if (responseErrors) {
                    Error.form.add(vm.account_form_password, responseErrors);
            }
        }
        }

        function _toggleMessage() {
            vm.isCollapsed = false;
            var timer = $timeout(function () {
                vm.isCollapsed = true;
            }, 1000);
        }

        function setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }
            angular.extend(vm.strings, {
                ACTION_SAVE: "Guardar",
                ACTION_REIMBURSE: "Reembolsar",
                COPY_BANKING: "Coloca los datos de tu cuenta bancaria para que recibas los pagos que los usuarios"
                    + " hacen al inscribirse. Tranquilo, esta información no la compartimos con nadie",
                COPY_NOT_AVAILABLE : "No Disponible",
                COPY_NA : "N/A",
                COPY_SEARCH_ORDERS_HELPER : "Buscar por número de orden, pago, detalle, etc.",
                SECTION_ACCOUNT: "Cuenta",
                TAB_EMAIL: "Correo Electrónico",
                TAB_PASSWORD: "Contraseña",
                TAB_BANKING: "Información Bancaria",
                TAB_HISTORY: "Historial de Ventas",
                TAB_SALES: "Ventas",
                TAB_REIMBURSEMENTS: "Reembolsos",
                LABEL_SEARCH_ORDERS : "Buscar Ordenes",
                LABEL_CURRENT_PASSWORD: "Contraseña Actual",
                LABEL_NEW_PASSWORD: "Nueva Contraseña",
                LABEL_REPEAT_PASSWORD: "Repetir Nueva Contraseña",
                LABEL_EMAIL: "Correo Electrónico",
                LABEL_ORDER: "Orden",
                LABEL_ACTIVITY: "Actividad",
                LABEL_PAYMENT: "Pago",
                LABEL_DETAIL: "Detalle",
                LABEL_DATE: "Fecha",
                LABEL_TOTAL: "Total",
            });
        }

        function activate() {
            setStrings();
        }

    }

})();