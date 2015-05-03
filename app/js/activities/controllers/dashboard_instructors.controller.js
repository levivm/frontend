/**
* Register controller
* @namespace thinkster.organizers.controllers
*/
(function () {
  'use strict';


  angular
    .module('trulii.activities.controllers')
    .controller('ActivityDBInstructorsController', ActivityDBInstructorsController);

  ActivityDBInstructorsController.$inject = ['$scope','$modal','$state','$filter','activity','organizer'];
  /**
  * @namespace ActivityCalendarController
  */
  function ActivityDBInstructorsController($scope,$modal,$state,$filter,activity,organizer) {


  //$scope.startOpened = false;
  var vm = this;
  initialize();
  vm.activity = angular.copy(activity);

  _setInstructors();

  vm.save_activity = _updateActivity;
  vm.addInstructor = _addInstructor;
  vm.removeInstructor = _removeInstructor;
  vm.setInstructor = _setInstructor;

  vm.deleteInstructor = _deleteInstructor;






  function _addInstructor(){

    if (vm.instructors.length >= organizer.max_allowed_instructors)
      return;

    vm.instructors.push({
      full_name:null,
    });

  }

  function _removeInstructor(){

    vm.instructors.pop();
  }

  function _deleteInstructor(instructor){

      var modalInstance = $modal.open({
        templateUrl:  'partials/activities/messages/confirm_delete_instructor.html',
        controller: 'ModalInstanceCtrl',
        size: 'lg',
      });

      modalInstance.result.then(function(){


        _initialize_errors_array();
        organizer.deleteInstructor(instructor.id)
          .then(function(response){
     
            _.remove(vm.activity.instructors,'id',instructor.id);    
            angular.extend(activity,vm.activity);
            organizer.reload().then(_setInstructors);

          },function(response){


            var index = _.indexOf(vm.instructors,instructor);

            vm.instructors_errors[index].delete_instructor = response.data.detail

          });

      });

  }

  function _setInstructor(selected_instructor,model,label,instructor){

    angular.extend(instructor,selected_instructor);
    _.remove(vm.typeahead_instructors,'id',selected_instructor.id);        

  }



  function _updateActivity() {
    _clearErrors();
    vm.activity.update()
        .then(_updateSuccess,_errored);  

  }


  function _updateSuccess(response){

    vm.isCollapsed = false;
    angular.extend(activity,vm.activity);
    organizer.reload().then(_setInstructors);
    $scope.pc.activitySectionUpdated(response.data);

  }

  function _clearErrors(){
    _initialize_errors_array();
  }



  function _addError(index,field, message) {
    

    vm.instructors_errors[index][field] = message.pop();


  };

  function _errored(response) {


    var errors = response.data.instructors

    _.each(errors,function(error_dict,index){

      _.each(error_dict,function(message,field){

          _addError(index,field,message);

      });
      
    });


  }

  function initialize(){

    _initialize_errors_array();
    vm.isCollapsed   = true;

  }

  function _initialize_errors_array(){

    vm.instructors_errors = [];
    for(var i = 0; i < organizer.max_allowed_instructors; i++) {
        vm.instructors_errors.push({});
    }
    
  }

  function _setInstructors(){



    vm.instructors = vm.activity.instructors;


    vm.typeahead_instructors = _.filter(organizer.instructors, function(instructor){ 
              return !_.findWhere(vm.instructors, instructor); 
            });

  }


  };

  })();