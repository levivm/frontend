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

    ActivityDBInstructorsController.$inject = ['$modal', 'activity', 'organizer', 'Toast', 'Elevator', 'Error'];

    function ActivityDBInstructorsController($modal, activity, organizer, Toast, Elevator, Error) {

        var vm = this;
        vm.activity = angular.copy(activity);
        vm.save_activity = _updateActivity;
        vm.addInstructor = _addInstructor;
        vm.removeInstructor = _removeInstructor;
        // vm.setInstructor = _setInstructor;
        // vm.deleteInstructor = _deleteInstructor;
        vm.maxAllowedInstructors = organizer.max_allowed_instructors;

        initialize();
        _setInstructors();

        function _addInstructor() {
            if (vm.instructors.length >= organizer.max_allowed_instructors)
                return;

            vm.instructors.push({
                full_name : null
            });
        }

        function _removeInstructor() {
            vm.instructors.pop();
            _onSectionUpdated();
        }

        // function _deleteInstructor(instructor) {

        //     var modalInstance = $modal.open({
        //         templateUrl : 'partials/activities/messages/confirm_delete_instructor.html',
        //         controller : 'ModalInstanceCtrl',
        //         size : 'lg'
        //     });

        //     modalInstance.result.then(function () {
        //         _initialize_errors_array();
        //         organizer.deleteInstructor(instructor.id)
        //             .then(success, error);
        //     });

        //     function success(response) {
        //         _.remove(vm.activity.instructors, 'id', instructor.id);
        //         angular.extend(activity, vm.activity);
        //         organizer.reload().then(_setInstructors);

        //         Toast.generics.deleted("El instructor se ha eliminado.");
        //     }

        //     function error(response) {
        //         var index = _.indexOf(vm.instructors, instructor);
        //         vm.instructors_errors[index].delete_instructor = response.data.detail;
        //     }

        // }

        // function _setInstructor(selected_instructor, model, label, instructor) {
        //     angular.extend(instructor, selected_instructor);
        //     _.remove(vm.typeahead_instructors, 'id', selected_instructor.id);
        // }

        function _updateActivity() {
            Error.form.clear(vm.activity_instructors_forms);
            vm.activity.update()
                .then(success, error);

            vm.isSaving = true;

            function success(response) {
                vm.isCollapsed = false;
                angular.extend(activity, vm.activity);
                organizer.reload().then(_setInstructors);
                _onSectionUpdated();

                vm.isSaving = false;

                Toast.generics.weSaved();
            }

            function error(responseErrors) {
                Error.form.add(vm.activity_instructors_forms, responseErrors);

                _onSectionUpdated();

                vm.isSaving = false;
            }


        }

        function _setInstructors() {
            vm.instructors = vm.activity.instructors;
        }

        function _onSectionUpdated() {
            activity.updateSection('instructors');
        }


        function initialize() {
            
            vm.isSaving = false;

            Elevator.toTop();
        }

    }

})();