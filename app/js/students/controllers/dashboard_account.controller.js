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

        vm.student = student;
        vm.orders = [];
        vm.password_data = {};
        vm.isCollapsed = true;
        vm.orderQuery = '';

        vm.changeEmail = _changeEmail;
        vm.changePassword = _changePassword;

        vm.isSaving = false;

        activate();

        //--------- Functions Implementation ---------//

        function _changeEmail() {
            console.log(vm.student);
            Error.form.clear(vm.account_form_email);
            vm.student.change_email()
                .then(_changeSuccess, fail);

            function fail(response){
                _changeFail(response, vm.account_form_email);

                vm.isSaving = false;
            }
        }

        function _changePassword() {
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
            Authentication.updateAuthenticatedAccount();
            
            vm.isSaving = false;
            Toast.info("Correo cambiado");
        }

        function _changeFail(response, form) {
            var responseErrors = response.data['form_errors'];
            if (responseErrors) {
                Error.form.add(form, responseErrors);
            }
        }        

        function getOrders(){
            student.getOrders().then(success, error);

            function success(orders){
                vm.orders = orders;
            }
            function error(orders){
                console.log('Error retrieving Student Orders History');
            }
        }

        function activate() {
            getOrders();
        }

    }

})();