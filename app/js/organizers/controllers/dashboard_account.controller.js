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
        vm.sales = [];
        vm.reimbursements = [];

        _activate();

        //--------- Exposed Functions ---------//

        function changeEmail() {
            vm.isSaving = true;
            Error.form.clear(vm.account_form_email);
            vm.organizer.change_email()
                .then(success, error);

            function success() {
                Authentication.updateAuthenticatedAccount();
                vm.isSaving = false;
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

        //--------- Internal Functions ---------//

        function _setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }
            angular.extend(vm.strings, {
                ACTION_SAVE: "Guardar",
                COPY_BANKING: "Coloque los datos de su cuenta bancaria para recibir los pagos de las inscripciones. "
                    + "Esta información no será compartida con nadie.",

                COPY_PASSWORD: "¿Desea cambiar su contraseña?",
                COPY_EMAIL: "¿Desea cambiar su correo electrónico?",
                SECTION_ACCOUNT: "Cuenta",
                TAB_EMAIL: "Correo Electrónico",
                TAB_PASSWORD: "Contraseña",
                TAB_BANKING: "Información Bancaria",
                LABEL_CURRENT_PASSWORD: "Contraseña Actual",
                LABEL_NEW_PASSWORD: "Nueva Contraseña",
                LABEL_REPEAT_PASSWORD: "Repetir Nueva Contraseña",
                LABEL_EMAIL: "Correo Electrónico"
            });
        }

        function _activate() {
            _setStrings();
        }

    }

})();