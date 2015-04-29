/**
* Register controller
* @namespace thinkster.organizers.controllers
*/
(function () {
  'use strict';


  angular
    .module('trulii.organizers.controllers')
    .controller('OrganizerDashboardCtrl', OrganizerDashboardCtrl);

  OrganizerDashboardCtrl.$inject = ['$state'];
  /**
  * @namespace RegisterController
  */
  function OrganizerDashboardCtrl($state) {

    var vm = this;
    vm.changeState = _changeState;

    function _changeState(newState){
        $state.go(newState);
    }


  };

  })();