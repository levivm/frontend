/**
 * @ngdoc controller
 * @name trulii.students.controllers.StudentAccountCtrl
 * @description Handles Student Account Dashboard
 * @requires student
 * @requires trulii.authentication.services.Authentication
 * @requires trulii.authentication.services.Error
 */

(function () {
    'use strict';

    angular
        .module('trulii.students.controllers')
        .controller('StudentAccountCtrl', StudentAccountCtrl);

    StudentAccountCtrl.$inject = ['$timeout', 'student', 'Authentication', 'Error', 'Toast'];
    function StudentAccountCtrl($timeout, student, Authentication, Error, Toast) {

        var vm = this;
        angular.extend(vm, {
            student : student,
            orders : [],
            password_data : {},
            isCollapsed : true,
            isSaving : false,
            orderQuery : '',
            changeEmail : changeEmail,
            changePassword : changePassword
        });

        activate();

        //--------- Functions Implementation ---------//

        function changeEmail() {
            console.log(vm.student);
            Error.form.clear(vm.account_form_email);
            vm.student.change_email()
                .then(_changeSuccess, fail);

            function fail(response){
                _changeFail(response, vm.account_form_email);

                vm.isSaving = false;
            }
        }

        function changePassword() {
            Error.form.clear(vm.account_form_password);

            if(vm.password_data.password === vm.password_data.password1){
              vm.isSaving = false;
              Toast.error(vm.strings.COPY_TOAST_SAME,{timeOut: 10000});
            }

            else{
              vm.student.change_password(vm.password_data)
                  .then(success, fail);
            }

            function success(response) {
                vm.isSaving = false;
                console.log(response);
                angular.extend(vm.password_data,{
                    'password':null,
                    'password1':null,
                    'password2':null,
                });

                Toast.info(vm.strings.COPY_TOAST_CHANGE_PASSWORD_INFO,
                        vm.strings.COPY_TOAST_CHANGE_PASSWORD,{timeOut: 10000});

            }

            function fail(response){
                _changeFail(response, vm.account_form_password);
                vm.isSaving = false;
            }
        }

        function _changeSuccess(response) {
            console.log(response);
            Authentication.getAuthenticatedAccount(true);
            vm.isSaving = false;
            Toast.info(vm.strings.COPY_TOAST_EMAIL_CHANGED_INFO,
                    vm.strings.COPY_TOAST_EMAIL_CHANGED,{timeOut: 10000});
        }

        function _changeFail(response, form) {
            var responseErrors = response.data;
            if (responseErrors) {
                Error.form.add(form, responseErrors);
            }
        }

        function _getOrders(){
            student.getOrders().then(success, error);

            function success(orders){
                vm.orders = orders;
            }
            function error(orders){
                console.log('Error retrieving Student Orders History');
            }
        }

        function _setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }
            angular.extend(vm.strings, {
                ACTION_SAVE: "Guardar",
                COPY_TAB_EMAIL: "Luego de cambiar tu dirección de correo electrónico te enviaremos un"
                       + " correo a tu nueva dirección.",
                COPY_TAB_PASSWORD: "En caso de modificar tu contraseña te recomendamos crear una segura y fácil de recordar.",
                LABEL_CURRENT_PASSWORD: "Contraseña actual",
                LABEL_NEW_PASSWORD: "Nueva contraseña",
                LABEL_CONFIRM_PASSWORD: "Confirmar nueva contraseña",
                LABEL_EMAIL: "Correo electrónico",
                SECTION_ACCOUNT: "Cuenta",
                TAB_PASSWORD: "Cambiar contraseña",
                TAB_EMAIL: "Correo electrónico",
                COPY_TOAST_EMAIL_CHANGED: "Correo cambiado",
                COPY_TOAST_EMAIL_CHANGED_INFO: "Si el correo electrónico llegó a tu nueva dirección, cierra sesión "
                        + "e inicia nuevamente con tu nueva dirección.",
                COPY_TOAST_CHANGE_PASSWORD: "Contraseña cambiada",
                COPY_TOAST_SAME: "Su nueva contraseña debe ser distinta a la anterior"
            });
        }

        function activate() {
            _setStrings();
            _getOrders();
        }

    }

})();
