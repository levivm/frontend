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
        'activity', 'cities', 'LocationManager'];

    function ActivityDBLocationController($scope, uiGmapGoogleMapApi, uiGmapIsReady, filterFilter,
                                          activity, cities, LocationManager) {

        var vm = this;

        vm.cities = cities;
        vm.activity = angular.copy(activity);
        vm.save_activity = _updateActivity;
        vm.setOverElement = _setOverElement;
        vm.showTooltip = _showTooltip;

        initialize();

        /******************ACTIONS**************/

        function _updateActivity() {
            _clearErrors();
            _setActivityPos();
            vm.activity.update()
                .then(_updateSuccess, _errored);

            function _updateSuccess(response) {
                vm.isCollapsed = false;
                angular.extend(activity, vm.activity);
                _onSectionUpdated();
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

        function _clearErrors() {
            vm.activity_location_form.$setPristine();
            vm.errors = {};
        }

        function _addError(field, message) {
            vm.errors[field] = message;
            vm.activity_location_form[field].$setValidity(message, false);
        }

        function _errored(errors) {
            angular.forEach(errors, function (message, field) {
                _addError(field, message[0]);
            });
        }

        function _onSectionUpdated() {
            activity.updateSection('location');
        }

        function initialize() {
            vm.errors = {};
            vm.isCollapsed = true;

            if (!vm.activity.location)
                vm.activity.location = {};
                vm.activity.location.city = LocationManager.getCurrentCity();

            vm.map = LocationManager.getMap(vm.activity.location);
            
            vm.marker = LocationManager.getMarker(vm.activity.location);

        }

        // function _initialize_map() {

        //     var latitude;
        //     var longitude;
        //     var location = {};

        //     if (vm.activity.location.point)
        //         location = angular.copy(vm.activity.location);
        //     else
        //         location = angular.copy(vm.activity.location.city);

        //     latitude = location.point[0];
        //     longitude = location.point[1];

        //     vm.map = {
        //         center : {latitude : latitude, longitude : longitude},
        //         zoom : 8,
        //         bounds : LocationManager.getAllowedBounds(),

        //         events : {

        //             bounds_changed : function (map, eventName, args) {

        //                 var _allowedBounds = LocationManager.getAllowedBounds();

        //                 var _northeast = _allowedBounds.northeast;
        //                 var _southwest = _allowedBounds.southwest;
        //                 var northeast = new google.maps.LatLng(_northeast.latitude, _northeast.longitude);
        //                 var southwest = new google.maps.LatLng(_southwest.latitude, _southwest.longitude);

        //                 var allowedBounds = new google.maps.LatLngBounds(southwest, northeast);

        //                 if (allowedBounds.contains(map.getCenter())) {
        //                     vm.map.control.valid_center = map.getCenter();
        //                     return;
        //                 }

        //                 map.panTo(vm.map.control.valid_center);

        //             }

        //         },
        //         control : {
        //             allowedBounds : LocationManager.getAllowedBounds()
        //         }
        //     };
        // }

        // function _setMarker() {

        //     var latitude = vm.activity.location.point ?
        //         vm.activity.location.point[0] : vm.activity.location.city.point[0];
        //     var longitude = vm.activity.location.point ?
        //         vm.activity.location.point[1] : vm.activity.location.city.point[1];

        //     vm.marker = {
        //         id : 0,
        //         coords : {
        //             latitude : latitude,
        //             longitude : longitude
        //         },
        //         options : {draggable : true},
        //         events : {
        //             dragend : function (marker, eventName, args) {
        //                 var lat = marker.getPosition().lat();
        //                 var lon = marker.getPosition().lng();

        //                 vm.marker.options = {
        //                     draggable : true,
        //                     labelContent : "lat: " + vm.marker.coords.latitude + ' ' + 'lon: ' + vm.marker.coords.longitude,
        //                     labelAnchor : "100 0",
        //                     labelClass : "marker-labels"
        //                 };
        //             }
        //         }
        //     };
        // }
    }

})();