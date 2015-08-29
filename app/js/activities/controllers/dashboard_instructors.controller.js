/**
 * @ngdoc controller
 * @name trulii.activities.controllers.ActivityDBInstructorsController
 * @description ActivityDBInstructorsController
 * @requires ng.$scope
 */

(function () {
    'use strict';

    angular
        .module('trulii.activities.controllers')
        .controller('ActivityDBInstructorsController', ActivityDBInstructorsController);

    ActivityDBInstructorsController.$inject = ['activity', 'organizer', 'Toast', 'Elevator', 'Error'];

    function ActivityDBInstructorsController(activity, organizer, Toast, Elevator, Error) {

        var MAX_INSTRUCTORS = organizer.max_allowed_instructors;

        var vm = this;

        vm.isSaving = false;
        vm.activity = angular.copy(activity);
        vm.organizer = organizer;
        vm.save_activity = _updateActivity;
        //vm.addInstructor = _addInstructor;
        //vm.removeInstructor = _removeInstructor;
        // vm.setInstructor = _setInstructor;
        // vm.deleteInstructor = _deleteInstructor;

        _activate();

        function _updateActivity() {
            Error.form.clear(vm.activity_instructors_forms);
            vm.activity.update().then(success, error);
            vm.isSaving = true;

            function success(response) {
                vm.isCollapsed = false;
                angular.extend(activity, vm.activity);
                _setInstructors();
                Toast.generics.weSaved();
                _onSectionUpdated();
                vm.isSaving = false;
            }

            function error(responseErrors) {
                Error.form.addArrayErrors(vm.activity_instructors_forms, responseErrors['instructors']);
                _onSectionUpdated();
                vm.isSaving = false;
            }
        }

        function _setInstructors() {
            var EMPTY_INSTRUCTOR = {
                'full_name': null,
                'website': null,
                'bio': null
            };
            var tempInstructor = null;

            vm.instructors = angular.copy(vm.activity.instructors);
            if(vm.instructors.length < MAX_INSTRUCTORS){
                while(vm.instructors.length < MAX_INSTRUCTORS){
                    tempInstructor = angular.extend({}, EMPTY_INSTRUCTOR);
                    vm.instructors.push(tempInstructor);
                    console.log(vm.instructors.length, vm.instructors[vm.instructors.length-1]);
                }
            }
            console.log('vm.activity.instructors:', vm.activity.instructors);
            console.log('vm.instructors:', vm.instructors);
            console.log('vm.instructors:', JSON.stringify(vm.instructors, null, 1));

        }

        function _activate() {
            Elevator.toTop();
            _setInstructors();
        }

    }

})();