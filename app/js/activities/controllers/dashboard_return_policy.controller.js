/**
* Register controller
* @namespace thinkster.organizers.controllers
*/
(function () {
  'use strict';


  angular
    .module('trulii.activities.controllers')
    .controller('ActivityDBReturnPDashboard', ActivityDBReturnPDashboard);

  ActivityDBReturnPDashboard.$inject = ['$scope','activity'];
  /**
  * @namespace ActivityDBReturnPDashboard
  */
  function ActivityDBReturnPDashboard($scope,activity) {

    var vm = this;
    
    vm.activity = activity;

    initialize();

    vm.save_activity  = _updateActivity;

    vm.setOverElement = _setOverElement;

    vm.showTooltip    = _showTooltip;



    

    /******************ACTIONS**************/


    
    function _updateActivity() {
        console.log(vm.activity);
        vm.activity.update()
            .success(function(response){
                vm.isCollapsed = false;
                $scope.pc.activitySectionUpdated(response);
            })
            .error(_errored);
    }

    function _showTooltip(element){

        if (vm.currentOverElement==element)
            return true
        return false
    }


    function _setOverElement(element){

        vm.currentOverElement = element;
    }



    /*****************SETTERS********************/





    /*********RESPONSE HANDLERS***************/





    function _clearErrors(){
        vm.activity_return_policy_form.$setPristine();
        vm.errors = null;
        vm.errors = {};
    }



    function _addError(field, message) {
      vm.errors[field] = message;
      vm.activity_return_policy_form[field].$setValidity(message, false);

    };

    function _errored(errors) {
        angular.forEach(errors, function(message,field) {


          _addError(field,message[0]);   

        });

    }


    function activate() {

      // If the user is authenticated, they should not be here.

    }

    function initialize(){

        vm.errors = {};
        vm.isCollapsed = true;

    }




       

  };

  })();