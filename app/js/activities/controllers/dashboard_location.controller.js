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

    ActivityDBLocationController.$inject = ['activity', 'cities', 'organizer','LocationManager', 'Toast', 'Elevator', 'Error'];

    function ActivityDBLocationController(activity, cities, organizer, LocationManager, Toast, Elevator, Error) {

        var vm = this;

        angular.extend(vm, { 
            organizer: organizer,
            cities: cities,
            activity: angular.copy(activity),
            save_activity: updateActivity,
            setOverElement: setOverElement,
            showTooltip: showTooltip,
            errors: {},
            isCollapsed: true,
            isSaving: false,
        });

        _activate();

        /******************ACTIONS**************/

        function updateActivity() {
            vm.isSaving = true;

            Error.form.clear(vm.activity_location_form);
            
            _setActivityPos();
            vm.activity.update_location()
                .then(updateSuccess, error);

            function updateSuccess(response) {
                vm.isCollapsed = false;
                angular.extend(activity, vm.activity);
                _setLocation();
                _onSectionUpdated();
                vm.isSaving = false;
                Toast.generics.weSaved();
            }

            function error(errors) {
                
                Error.form.add(vm.activity_location_form, errors);

                vm.isSaving = false;
            }

            
        }

        function showTooltip(element) {
            return vm.currentOverElement === element;
        }

        function setOverElement(element) {
            vm.currentOverElement = element;
        }

        /*****************SETTERS********************/

        function _setActivityPos() {
            vm.activity.location.point = [];
            vm.activity.location.point[0] = vm.marker.coords.latitude;
            vm.activity.location.point[1] = vm.marker.coords.longitude;
        }

        function _setLocation(){

            if (!vm.activity.location){ 

                if (vm.organizer.location){
                    vm.activity.location = angular.copy(vm.organizer.location);
                    vm.activity.location.address = null;
                }
                else{
                    vm.activity.location = {};
                    vm.activity.location.city = LocationManager.getCurrentCity();
                }

            }
            else{
                vm.activity.location.city = LocationManager.getCityById(vm.activity.location.city);
            }


        }


        function _setStrings(){
            if(!vm.strings){ vm.strings = {}; }
            angular.extend(vm.strings, {
                COPY_CITY: "Especifica en qué lugar se desarrollará tu actividad.",
                COPY_MAP_1: "Arrastre",
                COPY_MAP_2: "el indicador",
                COPY_MAP_3: "en el mapa hasta el lugar donde se llevará a cabo su actividad.",
                LABEL_CITY: "Ciudad",
                LABEL_SELECT: "Seleccione...",
                LABEL_ADDRESS: "Dirección exacta",
                LABEL_LOCATION: "Ubicación",
                ACTION_SAVE: "Guardar",
            });
        }

        function _setAddressAutoComplete(){
            if(!vm.activity.location && vm.organizer.location)
                vm.address_autocomplete = [vm.organizer.location.address];

        }

        function _onSectionUpdated() {

            activity.updateSection('location');
        }

        function _activate() {
            _setAddressAutoComplete();
            _setLocation();
            _setStrings();
            vm.map = LocationManager.getMap(vm.activity.location);
            vm.marker = LocationManager.getMarker(vm.activity.location);
            Elevator.toTop();
        }
    }

})();