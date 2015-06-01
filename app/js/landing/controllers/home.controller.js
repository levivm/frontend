
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

    HomeController.$inject = ['LocationManager', 'cities', 'authenticatedUser', 'Authentication'];

    function HomeController(LocationManager, cities, authenticatedUser, Authentication) {

        console.log('authenticatedUser:', authenticatedUser);
        var vm = this;

        vm.cities = cities;
        vm.current_city = null;
        vm.setCurrentCity = _setCurrentCity;
        vm.isStudent = Authentication.isStudent;
        vm.isOrganizer = Authentication.isOrganizer;

        activate();

        //--------- Functions Implementation ---------//

        function _setCurrentCity(city){
            LocationManager.setCurrentCity(city);
            console.log('setCurrentCity (', city, ')');
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

        function activate(){
            setStrings();
            vm.current_city = LocationManager.getCurrentCity();
        }

    }
})();