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
            vm.student.change_password(vm.password_data)
                .then(success, fail);

            function success(response) {
                vm.isSaving = false;
                Toast.info("Password cambiado");
            }

            function fail(response){
                _changeFail(response, vm.account_form_password);
                vm.isSaving = false;
            }
        }

        function _changeSuccess(response) {
            Authentication.getAuthenticatedAccount(true);
            vm.isSaving = false;
            Toast.info("Correo cambiado");
        }

        function _changeFail(response, form) {
            var responseErrors = response.data['form_errors'];
            console.log('responseErrors:', responseErrors);
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
                COPY_TAB_EMAIL: "Puedes modificar tu dirección de correo electrónico si así lo deseas",
                COPY_TAB_PASSWORD: "En caso de modificar tu contraseña te recomendamos crear una segura "
                    + "y fácil de recordar.",
                LABEL_CURRENT_PASSWORD: "Contraseña Actual",
                LABEL_NEW_PASSWORD: "Nueva Contraseña",
                LABEL_CONFIRM_PASSWORD: "Confirmar Nueva Contraseña",
                LABEL_EMAIL: "Correo Electrónico",
                SECTION_ACCOUNT: "Cuenta",
                TAB_PASSWORD: "Cambiar Contraseña",
                TAB_EMAIL: "Correo Electrónico"
            });
        }

        function activate() {
            _setStrings();
            _getOrders();
        }

    }

})();