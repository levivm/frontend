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
        vm.setInstructor = _setInstructor;
        vm.deleteInstructor = _deleteInstructor;
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

        function _deleteInstructor(instructor) {

            var modalInstance = $modal.open({
                templateUrl : 'partials/activities/messages/confirm_delete_instructor.html',
                controller : 'ModalInstanceCtrl',
                size : 'lg'
            });

            modalInstance.result.then(function () {
                _initialize_errors_array();
                organizer.deleteInstructor(instructor.id)
                    .then(deleteSuccess, deleteError);
            });

            function deleteSuccess(response) {
                _.remove(vm.activity.instructors, 'id', instructor.id);
                angular.extend(activity, vm.activity);
                organizer.reload().then(_setInstructors);

                Toast.generics.deleted("El instructor se ha eliminado.");
            }

            function deleteError(response) {
                var index = _.indexOf(vm.instructors, instructor);
                vm.instructors_errors[index].delete_instructor = response.data.detail;
            }

        }

        function _setInstructor(selected_instructor, model, label, instructor) {
            angular.extend(instructor, selected_instructor);
            _.remove(vm.typeahead_instructors, 'id', selected_instructor.id);
        }

        function _updateActivity() {
            _clearErrors();
            vm.activity.update()
                .then(_updateSuccess, _errored);

            vm.isSaving = true;
        }

        function _updateSuccess(response) {
            vm.isCollapsed = false;
            angular.extend(activity, vm.activity);
            organizer.reload().then(_setInstructors);
            _onSectionUpdated();

            vm.isSaving = false;

            Toast.generics.weSaved();
        }

        function _clearErrors() {
            _initialize_errors_array();
        }

        function _addError(index, field, message) {
            vm.instructors_errors[index][field] = message.pop();
        }

        function _errored(response) {
            var errors = response.data.instructors;
            _.each(errors, function (error_dict, index) {
                _.each(error_dict, function (message, field) {
                    _addError(index, field, message);
                });
            });

            _onSectionUpdated();

            vm.isSaving = false;
        }

        function _setInstructors() {
            vm.instructors = vm.activity.instructors;
            vm.typeahead_instructors = _.filter(organizer.instructors, function (instructor) {
                return !_.findWhere(vm.instructors, instructor);
            });
        }

        function _onSectionUpdated() {
            activity.updateSection('instructors');
        }

        function _initialize_errors_array() {
            vm.instructors_errors = [];
            for (var i = 0; i < organizer.max_allowed_instructors; i++) {
                vm.instructors_errors.push({});
            }
        }

        function initialize() {
            _initialize_errors_array();
            
            vm.isSaving = false;

            Elevator.toTop();
        }

    }

})();