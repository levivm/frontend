
/**
 * @ngdoc controller
 * @name trulii.landing.controllers.NotFoundController
 * @description NotFoundController
 */

(function () {
    'use strict';

    angular
        .module('trulii.landing.controllers')
        .controller('NotFoundController', NotFoundController);

    NotFoundController.$inject = ['$state', 'LocationManager', 'ActivitiesManager', 'cities'];

    function NotFoundController($state, LocationManager, ActivitiesManager, cities) {
        var vm = this;
        vm.q = null;
        vm.search_city = null;
        vm.cities = [];
        vm.isSearchVisible = true;
        vm.updateSearchCity = updateSearchCity;
        vm.search = search;

        _activate();

        //--------- Functions Implementation ---------//

        function search() {
            console.log('navbar. search.', 'q:', vm.q, 'cityId:', vm.search_city.id);
            ActivitiesManager.searchActivities(vm.q, vm.search_city.id).then(success, error);

            function success(response){
                console.log('search response:', response.data);
                $state.go('home', {'activities': response.data});
            }

            function error(response){
                if(!response){
                    console.log("Error. Can't search without a city. Please specify a city to search on");
                } else {
                    console.log('error searching for activities.', response);
                }
            }
        }

        function updateSearchCity() {
            LocationManager.setSearchCity(scope.search_city);
        }

        function _setCurrentCity() {
            vm.search_city = LocationManager.getCurrentCity();
        }

        function _setStrings(){
            if(!vm.strings){ vm.strings = {}; }
            angular.extend(vm.strings, {
                PLACEHOLDER_WANT_TO_LEARN: '¿Qué quieres morder hoy?',
                LABEL_CITY: 'Ciudad',
                LABEL_CITY_DEFAULT: 'Ciudad..'
            });
        }

        function _activate(){
            _setStrings();
            vm.cities = cities;
            _setCurrentCity();
        }

    }
})();