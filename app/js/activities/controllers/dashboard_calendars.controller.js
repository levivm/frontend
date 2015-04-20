/**
* Register controller
* @namespace thinkster.organizers.controllers
*/
(function () {
  'use strict';


  angular
    .module('trulii.activities.controllers')
    .controller('ActivityCalendarsController', ActivityCalendarsController);

  ActivityCalendarsController.$inject = ['$scope','$state','$stateParams','$filter','$modal','activity','calendars','CalendarsManager'];
  /**
  * @namespace ActivityCalendarController
  */
  function ActivityCalendarsController($scope,$state,$stateParams,$filter,$modal,activity,calendars,CalendarsManager) {


  //$scope.startOpened = false;
  var vm = this;
  vm.calendars = calendars;


  initialize();
  
  vm.createCalendar = _createCalendar;
  vm.loadCalendar   = _loadCalendar;
  vm.deleteCalendar = _deleteCalendar;
  vm.setCalendar    = _setCalendar;
  //.updatedCalendar  = _updatedCalendar;


  function _setCalendar(calendar){

    CalendarsManager.setCalendar(calendar);
    activity.load().then(function(data){

      $scope.$parent.pc.activitySectionUpdated(activity);

    });

    $state.go("^");
  }


  function _createCalendar(){

    $state.go(".detail");


  }

  function _loadCalendar(calendar){

   
    $state.go(".detail",{'id':calendar.id});

  }

  function _updatedCalendar(){

    
    $scope.pc.activitySectionUpdated(activity);
  }

  function _deleteCalendar(calendar){




    var modalInstance = $modal.open({
      templateUrl:  'partials/activities/messages/confirm_delete_calendar.html',
      controller: 'ModalInstanceCtrl',
      size: 'lg',
    });

    modalInstance.result.then(function(){

      CalendarsManager.deleteCalendar(calendar.id)
                      .then(_successDelete,_errorDelete);

    });


  }


  function _successDelete(response){
    
    activity.load().then(function(data){

      $scope.$parent.pc.activitySectionUpdated(activity);

    });

    //$scope.pc.activitySectionUpdated(response.data);

  }

  function _errorDelete(response){

    vm.calendar_errors = {}
    angular.forEach(response,function(value,key){

      vm.calendar_errors[key] = value;

    })


  }
  function initialize(){

    vm.calendar_errors = {}
  }


  };

  })();