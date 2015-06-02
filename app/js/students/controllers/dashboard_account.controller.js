/**
 * @ngdoc controller
 * @name trulii.students.controllers.StudentAccountCtrl
 * @description Handles Student Account Dashboard
 * @requires student
 * @requires trulii.authentication.services.Authentication
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
        vm.errors = {};
        vm.password_data = {};
        vm.isCollapsed = true;
        vm.orderQuery = '';

        vm.changeEmail = _changeEmail;
        vm.changePassword = _changePassword;

        activate();

        //--------- Functions Implementation ---------//

        function _changeEmail() {
            console.log(vm.student);
            vm.errors = Error.form.clear(vm.account_form_email, vm.errors);
            vm.student.change_email()
                .then(_changeSuccess, fail);

            function fail(response){
                _changeFail(response, vm.account_form_email);
            }
        }

        function _changePassword() {
            vm.errors = Error.form.clear(vm.account_form_password, vm.errors);
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
                vm.errors = Error.form.add(form, vm.errors, responseErrors);
            }
        }

        function _toggleMessage() {
            vm.isCollapsed = false;
            var timer = $timeout(function () {
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
            // If the user is authenticated, they should not be here.
            if (!(Authentication.isAuthenticated())) {
                $location.url('/');
            }

            getOrders();

        }

    }

})();