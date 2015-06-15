/**
* Register controller
* @namespace trulii.students.controllers
*/
(function () {
  'use strict';


  angular
    .module('trulii.students.controllers')
    .controller('StudentDashboardCtrl', StudentDashboardCtrl);

  StudentDashboardCtrl.$inject = ['$state'];
  /**
  * @namespace StudentDashboardCtrl
  */
  function StudentDashboardCtrl($state) {

    var vm = this;
    vm.changeState = _changeState;


    function _changeState(newState){
        $state.go(newState);
    }


  }

})();