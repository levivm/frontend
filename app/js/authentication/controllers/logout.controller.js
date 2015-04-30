/**
* LoginController
* @namespace thinkster.authentication.controllers
*/
(function () {
  'use static';

  angular
    .module('trulii.authentication.controllers')
    .controller('LogOutController', LogOutController);

  LogOutController.$inject = ['$location', '$scope','$state','Authentication'];

  
  function LogOutController($location, $scope,$state,Authentication) {
    
    Authentication.logout().then(_successLogout);

    function _successLogout(){

      $state.go("home");
    }
  }
})();