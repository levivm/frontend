/**
* Register controller
* @namespace thinkster.organizers.controllers
*/
(function () {
  'use strict';

  angular
    .module('trulii.activities.controllers')
    .controller('ActivityDBLocationController', ActivityDBLocationController);

  ActivityDBLocationController.$inject = ['$scope','uiGmapGoogleMapApi','uiGmapIsReady','filterFilter',
                  'LocationManager','activity','cities','organizer'];

    /**
  * @namespace ActivityDBLocationController
  */
  function ActivityDBLocationController($scope,uiGmapGoogleMapApi,uiGmapIsReady,filterFilter,
                  LocationManager,activity,cities,organizer) {

    var vm = this;

    vm.errors = {};

    vm.isCollapsed = true;

    vm.cities = cities;

    vm.activity = angular.copy(activity);

    initialize_map();

    vm.save_activity  = _updateActivity;

    vm.setOverElement = _setOverElement;

    vm.showTooltip    = _showTooltip;


    /******************ACTIONS**************/


    
    function _updateActivity() {
        _clearErrors();
        _setActivityPos();
        vm.activity.update()
            .then(_updateSuccess,_errored);
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

    function _setActivityPos(){
      vm.activity.location.point = [];
      vm.activity.location.point[0] = vm.marker.coords.latitude;
      vm.activity.location.point[1] = vm.marker.coords.longitude;
    }




    /*********RESPONSE HANDLERS***************/


    function _updateSuccess(response){

      vm.isCollapsed = false;
      angular.extend(activity,vm.activity);
      $scope.pc.activitySectionUpdated(response.data);



    }


    function _clearErrors(){

        vm.activity_location_form.$setPristine();
        vm.errors = {};
    }



    function _addError(field, message) {
      vm.errors[field] = message;
      vm.activity_location_form[field].$setValidity(message, false);

    };

    function _errored(errors) {
        angular.forEach(errors, function(message,field) {


          _addError(field,message[0]);   

        });

    }


    function initialize_map(){

        var location;

        location = vm.activity.location.point? vm.activity.location: organizer.location;
        vm.activity.location = location;
        vm.map = LocationManager.getMap(location);
        vm.marker = LocationManager.getMarker(location);

    }

  }

  })();