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

    OrganizerAccountCtrl.$inject = ['$state', 'Authentication', 'Toast', 'Error', 'organizer', 'bankingInfo', 'bankingData'];
    function OrganizerAccountCtrl($state, Authentication, Toast, Error, organizer, bankingInfo, bankingData) {

        var vm = this;
        angular.extend(vm, {
            organizer : organizer,
            bankingInfo: bankingInfo,
            bankingData: {},
            password_data : {},
            isCollapsed : true,
            isSaving:false,
            isSavingEmail : false,
            isSavingPassword : false,
            sales : [],
            reimbursements : [],
            changeEmail : changeEmail,
            changePassword : changePassword,
            updateBankingInfo: updateBankingInfo,
            checkTypePerson: _checkTypePerson
        });

        _activate();

        //--------- Exposed Functions ---------//

        function updateBankingInfo(){
            vm.isSaving = true;
            vm.bankingData.organizer = organizer.id;
            Error.form.clear(vm.account_form_banking_info);
            organizer.saveBankingInfo(vm.bankingData).then(success, error);

            function success(bankingData){
                vm.isSaving = false;
                angular.extend(vm.bankingData, bankingData);
                Toast.generics.weSaved();
            }

            function error(responseErrors){
                vm.isSaving = false;
                if(responseErrors){
                    Error.form.add(vm.account_form_banking_info, responseErrors);
                }
                
                if(vm.bankingData.id){
                    Toast.error(vm.strings.TOAST_ERROR_PUT);
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
        
        function _checkTypePerson(){
            vm.showLegal =  vm.bankingData.person_type==2 ? true:false;
        }

        //--------- Internal Functions ---------//

        function _setOrganizerBankingData(){
            console.log(vm.bankingInfo);
            if(!(_.isEmpty(bankingData))){ 
                var current_bank_data = _.find(vm.bankingInfo.banks, 
                                                { 'bank_name': bankingData.bank });
                vm.bankingData = bankingData; 
                vm.bankingData.bank = current_bank_data.bank_id;
            }
        }
        
        function _setLegalData(){ 
            vm.bankingData.regimen = vm.bankingData.regimen ? vm.bankingData.regimen:"";
            vm.bankingData.fiscal_address = vm.bankingData.fiscal_address ? vm.bankingData.fiscal_address:"";
            vm.bankingData.billing_telephone = vm.bankingData.billing_telephone ? vm.bankingData.billing_telephone:"";
        }

        function _setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }
            angular.extend(vm.strings, {
                ACTION_SAVE: "Guardar",
                COPY_BANKING: "Coloca los datos de tu cuenta bancaria para poder transferirte el dinero de las inscripciones que recibas. "
                    + "Relax, esta información no la compartiremos con nadie.",
                COPY_SETTINGS: "Cambia tu dirección de correo electrónico cuando quieras. Te enviaremos un correo electornico a tu nueva dirección para que confirmes el cambio.",
                COPY_PASSWORD: "¿Desea cambiar su contraseña?",
                COPY_EMAIL: "¿Desea cambiar su correo electrónico?",
                SECTION_ACCOUNT: "Cuenta",
                SECTION_ACCOUNT_SETTINGS: "Cuenta > Ajustes",
                SECTION_ACCOUNT_BANK: "Cuenta > Información Bancaria",
                TAB_SETTINGS: "Ajustes",
                TAB_BANKING: "Información Bancaria",
                LABEL_CURRENT_PASSWORD: "Contraseña Actual",
                LABEL_NEW_PASSWORD: "Nueva Contraseña",
                LABEL_REPEAT_PASSWORD: "Repetir Nueva Contraseña",
                LABEL_EMAIL: "Correo Electrónico",
                LABEL_BANK: "Banco",
                LABEL_TYPE_PERSON: "Tipo de persona",
                LABEL_REGIMEN:"Regimen",
                LABEL_FISCAL_ADDRESS: "Dirección fiscal",
                LABEL_FISCAL_PHONE: "Teléfono fiscal",
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
                OPTION_DEFAULT_SELECT_TYPE: "Seleccione un tipo de persona",
                OPTION_DEFAULT_SELECT_REGIMEN: "Seleccione un regimen",
                OPTION_DEFAULT_SELECT_DOCUMENT_TYPE: "Tipo de Documento",
                OPTION_DEFAULT_SELECT_ACCOUNT_TYPE: "Tipo de Cuenta",
                TOAST_ERROR_PUT: "Por seguridad no puedes modificar los datos bancarios, comunicate con nosotros."
            });
        }

        function _activate() {
            _setStrings();
            _setOrganizerBankingData();
            vm.showLegal = false;
            _checkTypePerson();
            _setLegalData();
            
        }

    }

})();
