/**
* Register controller
* @namespace thinkster.authentication.controllers 
*/
(function () {
  'use strict';

  angular
    .module('trulii.landing.controllers')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$scope','$cookies','LocationManager','cities','authenticatedUser'];

  /**
  * @namespace RegisterController
  */
  function HomeController($scope,$cookies,LocationManager,cities,authenticatedUser) {

    var vm = this;
    vm.cities = cities;
    vm.current_city = null;
    vm.isUserAuthenticated = authenticatedUser !== undefined;
    vm.setCurrentCity = _setCurrentCity;

    activate();

    function _setCurrentCity(city){
      LocationManager.setCurrentCity(city);
      console.log("cityyyyyyyyyyyyy",city);
    }

    function activate(){
      vm.current_city = LocationManager.getCurrentCity();
      console.log("ZZZZZ",vm.current_city);
    }

  }
})();