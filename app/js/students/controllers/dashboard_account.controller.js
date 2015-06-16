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

    StudentAccountCtrl.$inject = ['$timeout', 'student', 'Authentication', 'Error'];
    function StudentAccountCtrl($timeout, student, Authentication, Error) {

        var vm = this;

        vm.student = student;
        vm.orders = [];
        vm.password_data = {};
        vm.isCollapsed = true;
        vm.orderQuery = '';

        vm.changeEmail = _changeEmail;
        vm.changePassword = _changePassword;

        activate();

        //--------- Functions Implementation ---------//

        function _changeEmail() {
            console.log(vm.student);
            Error.form.clear(vm.account_form_email);
            vm.student.change_email()
                .then(_changeSuccess, fail);

            function fail(response){
                _changeFail(response, vm.account_form_email);
            }
        }

        function _changePassword() {
            Error.form.clear(vm.account_form_password);
            vm.student.change_password(vm.password_data)
                .then(success, fail);

            function success(response) {
                console.log('Success changing password');
            }

            function fail(response){
                _changeFail(response, vm.account_form_password);
            }
        }

        function _changeSuccess(response) {
            Authentication.updateAuthenticatedAccount();
            _toggleMessage();
        }

        function _changeFail(response, form) {
            var responseErrors = response.data['form_errors'];
            if (responseErrors) {
                Error.form.add(form, responseErrors);
            }
        }

        function _toggleMessage() {
            vm.isCollapsed = false;
            $timeout(function () {
                vm.isCollapsed = true;
            }, 1000);
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