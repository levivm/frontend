
/**
 * @ngdoc controller
 * @name trulii.landing.controllers.HomeController
 * @description HomeController
 * @requires trulii.locations.services.LocationManager
 * @requires cities
 * @requires authenticatedUser
 */

(function () {
    'use strict';

    angular
        .module('trulii.landing.controllers')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$stateParams', 'LocationManager', 'ActivitiesManager', 'Authentication',
        'cities', 'authenticatedUser'];

    function HomeController($stateParams, LocationManager, ActivitiesManager, Authentication,
        cities, authenticatedUser) {

        console.log('authenticatedUser:', authenticatedUser);
        var vm = this;

        vm.activities = [];
        vm.cities = cities;
        vm.current_city = null;
        vm.setCurrentCity = _setCurrentCity;
        vm.isStudent = false;
        vm.isOrganizer = false;
        vm.options = {
            actions: ['view', 'edit', 'contact', 'manage', 'republish']
        };

        activate();

        //--------- Functions Implementation ---------//

        function _setCurrentCity(city){
            LocationManager.setCurrentCity(city);
            console.log('setCurrentCity(', city, ')');
        }

        function setStrings(){
            if(!vm.strings){ vm.strings = {}; }
            angular.extend(vm.strings, {
                CITIES_LABEL : 'Ciudades',
                SIGN_UP_LABEL : 'Registrarse',
                LOGIN_LABEL : 'Iniciar Sesión',
                LOGOUT_LABEL : 'Logout',
                NEW_ACTIVITY_LABEL : 'Crear Actividad',
                DASHBOARD_LABEL : 'Dashboard'
            });
        }

        function getActivities(){
            ActivitiesManager.getActivities().then(success, error);

            function success(response){
                vm.activities = response;
            }
            function error(response){
                console.log('getActivities. Error obtaining Activities from ActivitiesManager');
            }
        }

        function activate(){
            setStrings();
            if($stateParams.activities){
                vm.activities = $stateParams.activities;
            } else {
                getActivities();
            }
            vm.current_city = LocationManager.getCurrentCity();
        }

    }
})();