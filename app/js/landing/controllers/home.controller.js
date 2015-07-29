
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

    HomeController.$inject = ['$stateParams', 'LocationManager', 'ActivitiesManager', 'cities'];

    function HomeController($stateParams, LocationManager, ActivitiesManager, cities) {

        var vm = this;
        angular.extend(vm, {
            activities : [],
            cities : cities,
            current_city : null,
            setCurrentCity : setCurrentCity,
            isStudent : false,
            isOrganizer : false,
            options : {
                actions: ['view', 'edit', 'contact', 'manage', 'republish']
            }
        });

        _activate();

        //--------- Exposed Functions ---------//

        function setCurrentCity(city){
            LocationManager.setCurrentCity(city);
            console.log('setCurrentCity(', city, ')');
        }

        //--------- Internal Functions ---------//

        function _getActivities(){
            ActivitiesManager.getActivities().then(success, error);

            function success(response){
                vm.activities = response;
                console.log('activities from ActivitiesManager:', vm.activities);
            }
            function error(response){
                console.log('getActivities. Error obtaining Activities from ActivitiesManager');
            }
        }

        function _setStrings(){
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

        function _activate(){
            _setStrings();
            if($stateParams.activities){
                console.log('activities from $stateParams:', $stateParams.activities);
                vm.activities = $stateParams.activities;
            } else {
                _getActivities();
            }
            vm.current_city = LocationManager.getCurrentCity();
        }

    }
})();