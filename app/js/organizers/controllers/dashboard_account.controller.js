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

    OrganizerAccountCtrl.$inject = ['$state', 'Authentication', 'Toast', 'Error', 'organizer', 'bankingInfo'];
    function OrganizerAccountCtrl($state, Authentication, Toast, Error, organizer, bankingInfo) {

        var vm = this;
        angular.extend(vm, {
            organizer : organizer,
            bankingInfo: bankingInfo,
            bankingData: {
                'organizer': organizer.id
            },
            password_data : {},
            isCollapsed : true,
            isSaving:false,
            isSavingEmail : false,
            isSavingPassword : false,
            sales : [],
            reimbursements : [],
            changeEmail : changeEmail,
            changePassword : changePassword,
            updateBankingInfo: updateBankingInfo
        });

        _activate();

        //--------- Exposed Functions ---------//

        function updateBankingInfo(){
            vm.isSaving = true;
            Error.form.clear(vm.account_form_banking_info);
            organizer.saveBankingInfo(vm.bankingData).then(success, error);

            function success(bankingData){
                vm.isSaving = false;
                console.log('bankingData response', bankingData);
                Toast.generics.weSaved();
            }

            function error(responseErrors){
                vm.isSaving = false;
                console.log('Error updating bankingData', responseErrors);
                if(responseErrors){
                    Error.form.add(vm.account_form_banking_info, responseErrors);
                }
            }
        }

        function changeEmail() {
            vm.isSavingEmail = true;
            Error.form.clear(vm.account_form_email);
            vm.organizer.change_email()
                .then(success, error);

            function success() {
                Toast.generics.weSaved();
                vm.isSavingEmail = false;
            }

            function error(response) {
                vm.isSavingEmail = false;
                var responseErrors = response.data;
                if (responseErrors) {
                    Error.form.add(vm.account_form_email, responseErrors);
                }
            }
        }

        function changePassword() {
            vm.isSavingPassword = true;
            Error.form.clear(vm.account_form_password);
            vm.organizer.change_password(vm.password_data)
                .then(success, error);

            function success() {
                vm.isSavingPassword = false;
                $state.go('general-message', {
                    'module_name' : 'authentication',
                    'template_name' : 'change_password_success',
                    'redirect_state' : 'home'
                });
            }

            function error(response) {
                vm.isSavingPassword = false;
                var responseErrors = response.data;
                if (responseErrors) {
                    Error.form.add(vm.account_form_password, responseErrors);
                }
            }
        }

        //--------- Internal Functions ---------//

        function _getOrganizerBankingInfo(){

            organizer.getBankingInfo().then(success);

            function success(bankingData){
                if(bankingData){ vm.bankingData = bankingData; }
            }
        }

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
                TAB_SETTINGS: "Ajustes",
                TAB_BANKING: "Información Bancaria",
                LABEL_CURRENT_PASSWORD: "Contraseña Actual",
                LABEL_NEW_PASSWORD: "Nueva Contraseña",
                LABEL_REPEAT_PASSWORD: "Repetir Nueva Contraseña",
                LABEL_EMAIL: "Correo Electrónico",
                LABEL_BANK: "Banco",
                LABEL_DOCUMENT: "Documento",
                LABEL_DOCUMENT_TYPE: "Tipo de Documento",
                LABEL_DOCUMENT_NUMBER: "Número de Documento",
                LABEL_BENEFICIARY: "Beneficiario",
                LABEL_ACCOUNT_TYPE: "Tipo de Cuenta",
                LABEL_ACCOUNT_NUMBER: "Número de Cuenta",
                PLACEHOLDER_DOCUMENT_NUMBER: "Ej. 1.009.099",
                PLACEHOLDER_ACCOUNT_NUMBER: "Ej. 5009099",
                SUB_SECTION_EMAIL: "Correo Electrónico",
                SUB_SECTION_PASSWORD: "Contraseña",
                OPTION_DEFAULT_SELECT_BANK: "Seleccione un banco",
                OPTION_DEFAULT_SELECT_DOCUMENT_TYPE: "Tipo de Documento",
                OPTION_DEFAULT_SELECT_ACCOUNT_TYPE: "Tipo de Cuenta"
            });
        }

        function _activate() {
            _setStrings();
            _getOrganizerBankingInfo();
        }

    }

})();
