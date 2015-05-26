/**
 * @ngdoc controller
 * @name trulii.students.controllers.StudentProfileCtrl
 * @description ActivityDashboardCtrl
 * @requires ng.$scope
 */

(function () {
    'use strict';

    angular
        .module('trulii.students.controllers')
        .controller('StudentProfileCtrl', StudentProfileCtrl);

    StudentProfileCtrl.$inject = ['$timeout', '$state', 'Authentication', 'datepickerPopupConfig', 'student'];

    function StudentProfileCtrl($timeout, $state, Authentication, datepickerPopupConfig, student) {

        var vm = this;
        var cache_student = Authentication.getAuthenticatedAccount();

        vm.bio_max = 140;
        vm.student = student;
        vm.isChangingPicture = false;
        vm.errors = {};
        vm.isCollapsed = true;
        vm.updateProfile = updateProfile;

        student.getOrders().then(function(result){
            console.log('student.getOrders:', result);
        });

        initialize();

        //--------- Functions Implementation ---------//

        function updateProfile(){
            _clearErrors(profile_form);
            vm.student.update().then(updateSuccess, updateError);

            function updateSuccess(){}
            function updateError(response){
                angular.forEach(response.data['form_errors'], function(errors, field) {
                   _addError(field, errors[0]);
                });
            }
        }

         function _clearErrors(form){
           form.$setPristine();
           vm.errors = null;
           vm.errors = {};
         }

         function _addError(field, message) {
           vm.errors[field] = message;
        //   if (field in vm.account_form_email)
        //     vm.account_form_email[field].$setValidity(message, false);
         }

        function initialize() {
            datepickerPopupConfig.showButtonBar = false;
        }

    }

})();