/**
* Register controller
* @namespace thinkster.organizers.controllers
*/
(function () {
  'use strict';


  angular
    .module('trulii.activities.controllers')
    .controller('ActivityCalendarController', ActivityCalendarController);

  ActivityCalendarController.$inject = ['$scope','$timeout','activity','datepickerPopupConfig','calendar'];
  /**
  * @namespace ActivityCalendarController
  */
  function ActivityCalendarController($scope,$timeout,activity,datepickerPopupConfig,calendar) {



  //$scope.startOpened = false;
  var vm = this;
  //vm.start_date = "asdasd";
  activate();
  initialize();
  //this.openStartDate = 
  //console.log(,"SCOPE");

  vm.calendar  = calendar;
  
  if (vm.calendar.id)
    vm.save_calendar = _updateCalendar;
  else
    vm.save_calendar = _createCalendar;



  function activate(){


    vm.isCollapsed = true;
    datepickerPopupConfig.showButtonBar = false;
  }

  function initialize(){

    vm.formats = ['dd - MM - yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    vm.format = vm.formats[0];

    vm.hstep = 1;
    vm.mstep = 15;

    vm.minStartDate = new Date();

    vm.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    vm.errors  = {};

    vm.ismeridian = true;

    vm.isSaving = false;

  }


  function _createCalendar(){

    _clearErrors();
    console.log(vm.calendar,"dd");
    vm.calendar.create()
               .then(_successCreated,_errored);

  }

  function _updateCalendar(){

    _clearErrors();
    console.log(vm.calendar,"dd");
    vm.calendar.update()
               .then(_successUpdate,_errored);

  }



    function _clearErrors(){
        vm.activity_calendar_form.$setPristine();
        vm.errors = null;
        vm.errors = {};
    }

    function _addError(field, message) {
      console.log("field error",field,message);
      vm.errors[field] = message;

      var is_session_error = field.split("_")[0] == 'sessions' ? true:false;

      vm.errors.session_error = is_session_error ? message:null;

      if (field == "non_field_errors")
        return;


      var valid_form_field = vm.activity_calendar_form[field] ? vm.activity_calendar_form[field]:false;
      if (valid_form_field)
         valid_form_field.$setValidity(message, false);


    };



    function _errored(errors) {

        //console.log("EROOOOOR",errors);
        //console.log("EROOOOOR",errors);
        angular.forEach(errors, function(message,field) {
          _addError(field,message[0]);

        });

        $scope.isSaving = false;

    }

    function _successCreated(calendar){


      vm.save_calendar = _updateCalendar;
      vm.isCollapsed = false;
      $scope.$parent.vm.setCalendar(calendar);

      vm.isSaving = false;

    }

    function _successUpdate(calendar){
      vm.isCollapsed = false;
      $scope.$parent.vm.setCalendar(calendar);

      vm.isSaving = false;


    }




  };

  })();