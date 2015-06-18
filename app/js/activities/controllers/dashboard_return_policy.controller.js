/**
 * @ngdoc controller
 * @name trulii.activities.controllers.ActivityDBReturnPDashboard
 * @description ActivityDBReturnPDashboard
 * @requires ng.$scope
 */

(function () {
    'use strict';

    angular
        .module('trulii.activities.controllers')
        .controller('ActivityDBReturnPDashboard', ActivityDBReturnPDashboard);

    ActivityDBReturnPDashboard.$inject = ['$scope', 'activity', 'Toast', 'Error'];

    function ActivityDBReturnPDashboard($scope, activity, Toast, Error) {

        var vm = this;

        vm.activity = activity;
        vm.save_activity = _updateActivity;
        vm.setOverElement = _setOverElement;
        vm.showTooltip = _showTooltip;

        activate();

        /******************ACTIONS**************/

        function _updateActivity() {
            console.log(vm.activity);
            vm.activity.update()
                .then(_updateSuccess, _errored);

            vm.isSaving = true;
        }

        function _showTooltip(element) {
            return vm.currentOverElement == element;
        }

        function _setOverElement(element) {
            vm.currentOverElement = element;
        }

        /*****************SETTERS********************/

        /*********RESPONSE HANDLERS***************/

        function _updateSuccess(response) {
            Error.form.clear(vm.activity_return_policy_form);
            vm.isCollapsed = false;
            _onSectionUpdated();

            vm.isSaving = false;

            Toast.generics.weSaved();
        }

        function _errored(errors) {
            Error.form.add(vm.activity_return_policy_form, errors);
            _onSectionUpdated();
            vm.isSaving = false;
        }

        function _onSectionUpdated() {
            activity.updateSection('return-policy');
        }

        function activate() {
            vm.errors = {};
            vm.isCollapsed = true;
            vm.isSaving = false;
        }

    }

})();