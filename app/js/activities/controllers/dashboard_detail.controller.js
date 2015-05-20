/**
 * @ngdoc controller
 * @name trulii.activities.controllers.ActivityDBDetailController
 * @description ActivityDBDetailController
 * @requires ng.$scope
 * @requires trulii.activities.services.Activity
 * @requires activity
 */

(function () {
    'use strict';

    angular
        .module('trulii.activities.controllers')
        .controller('ActivityDBDetailController', ActivityDBDetailController);

    ActivityDBDetailController.$inject = ['$scope', '$state', '$timeout', '$q', '$stateParams', 'activity', 'Elevator', 'Toast'];

    function ActivityDBDetailController($scope, $state, $timeout, $q, $stateParams, activity, Elevator, Toast) {

        var vm = this;

        vm.activity = angular.copy(activity);
        vm.save_activity = _updateActivity;
        vm.setOverElement = _setOverElement;
        vm.showTooltip = _showTooltip;

        initialize();

        /******************ACTIONS**************/

        function _updateActivity() {
            vm.isSaving = true;

            _clearErrors();

            vm.activity.update()
                .then(_updateSuccess, _errored);
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
            vm.isSaving = false;
            angular.extend(activity, vm.activity);
            _onSectionUpdated();

            Toast.generics.weSaved();

        }

        function _clearErrors() {
            vm.activity_detail_form.$setPristine();
            vm.errors = null;
            vm.errors = {};
        }

        function _addError(field, message) {
            vm.errors[field] = message;
            vm.activity_detail_form[field].$setValidity(message, false);
        }

        function _errored(errors) {
            vm.isSaving = false;
            angular.forEach(errors, function (message, field) {
                _addError(field, message[0]);
            });
        }

        function _onSectionUpdated() {
            activity.updateSection('detail');
        }

        function activate() {
            // If the user is authenticated, they should not be here.
        }

        function initialize() {
            vm.errors = {};
            vm.isCollapsed = true;
            vm.isSaving = false;

            Elevator.toTop();
        }

    }

})();