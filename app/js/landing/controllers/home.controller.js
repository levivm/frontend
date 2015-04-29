
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

    HomeController.$inject = ['LocationManager', 'cities', 'authenticatedUser'];

    function HomeController(LocationManager, cities, authenticatedUser) {

        var vm = this;

        vm.cities = cities;
        vm.current_city = null;
        vm.isUserAuthenticated = authenticatedUser !== undefined;
        vm.setCurrentCity = _setCurrentCity;
        vm.strings = {};
        vm.strings.CITIES_LABEL = 'Ciudades';
        vm.strings.CITIES_LABEL = 'Ciudades';
        vm.strings.SIGN_UP_LABEL = 'Registrarse';
        vm.strings.LOGIN_LABEL = 'Iniciar Sesión';
        vm.strings.LOGOUT_LABEL = 'Logout';
        vm.strings.NEW_ACTIVITY_LABEL = 'Crear Actividad';
        vm.strings.DASHBOARD_LABEL = 'Dashboard';

        activate();

        //--------- Functions Implementation ---------//

        function _setCurrentCity(city){
            LocationManager.setCurrentCity(city);
            console.log('setCurrentCity (', city, ')');
        }

        function activate(){

            LocationManager.getCurrentCity().then(success, error);

            function success(city){
                vm.current_city = city;
                console.log('getCurrentCity: ', vm.current_city);
            }
            function error(){
                console.log("Couldn't obtain current city");
            }
        }

    }
})();