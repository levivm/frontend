/**
 * @ngdoc controller
 * @name trulii.activities.controllers.ActivityDBLocationController
 * @description ActivityDBLocationController
 * @requires ng.$scope
 */

(function () {
    'use strict';

    angular
        .module('trulii.activities.controllers')
        .controller('ActivityDBLocationController', ActivityDBLocationController);

    ActivityDBLocationController.$inject = ['$scope', 'uiGmapGoogleMapApi', 'uiGmapIsReady', 'filterFilter',
        'activity', 'cities', 'LocationManager', 'Toast', 'Elevator', 'Error'];

    function ActivityDBLocationController($scope, uiGmapGoogleMapApi, uiGmapIsReady, filterFilter,
                                          activity, cities, LocationManager, Toast, Elevator, Error) {

        var vm = this;

        vm.cities = cities;
        vm.activity = angular.copy(activity);
        vm.save_activity = _updateActivity;
        vm.setOverElement = _setOverElement;
        vm.showTooltip = _showTooltip;

        initialize();

        /******************ACTIONS**************/

        function _updateActivity() {
            vm.isSaving = true;

            Error.form.clear(vm.activity_location_form);
            
            _setActivityPos();
            vm.activity.update_location()
                .then(updateSuccess, error);

            function updateSuccess(response) {
                vm.isCollapsed = false;
                angular.extend(activity, vm.activity);
                _onSectionUpdated();

                vm.isSaving = false;

                Toast.generics.weSaved();
            }

            function error(errors) {
                
                Error.form.add(vm.activity_location_form, errors);

                vm.isSaving = false;
            }

            
        }

        function _showTooltip(element) {
            return vm.currentOverElement === element;
        }

        function _setOverElement(element) {
            vm.currentOverElement = element;
        }

        /*****************SETTERS********************/

        function _setActivityPos() {
            vm.activity.location.point = [];
            vm.activity.location.point[0] = vm.marker.coords.latitude;
            vm.activity.location.point[1] = vm.marker.coords.longitude;
        }

        /*********RESPONSE HANDLERS***************/
        



        function _onSectionUpdated() {
            activity.updateSection('location');
        }

        function initialize() {
            vm.errors = {};
            vm.isCollapsed = true;
            vm.isSaving = false;

            if (!vm.activity.location)
                vm.activity.location = {};
                vm.activity.location.city = LocationManager.getCurrentCity();

            vm.map = LocationManager.getMap(vm.activity.location);
            
            vm.marker = LocationManager.getMarker(vm.activity.location);

            Elevator.toTop();

        }

    }

})();