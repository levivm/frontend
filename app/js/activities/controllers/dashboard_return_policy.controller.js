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

    ActivityDBReturnPDashboard.$inject = ['$scope', 'activity', 'Toast'];

    function ActivityDBReturnPDashboard($scope, activity, Toast) {

        var vm = this;

        vm.activity = activity;
        vm.save_activity = _updateActivity;
        vm.setOverElement = _setOverElement;
        vm.showTooltip = _showTooltip;

        initialize();

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
            vm.isCollapsed = false;
            _onSectionUpdated();

            vm.isSaving = false;

            Toast.generics.weSaved();
        }

        function _clearErrors() {
            vm.activity_return_policy_form.$setPristine();
            vm.errors = null;
            vm.errors = {};
        }

        function _addError(field, message) {
            vm.errors[field] = message;
            vm.activity_return_policy_form[field].$setValidity(message, false);
        }

        function _errored(errors) {
            angular.forEach(errors, function (message, field) {
                _addError(field, message[0]);
            });
            _onSectionUpdated();

            vm.isSaving = false;
        }

        function _onSectionUpdated() {
            activity.updateSection('return-policy');
        }

        function activate() {
            // If the user is authenticated, they should not be here.
        }

        function initialize() {
            vm.errors = {};
            vm.isCollapsed = true;
            vm.isSaving = false;
        }

    }

})();