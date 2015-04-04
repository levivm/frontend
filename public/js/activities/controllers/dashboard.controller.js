/**
* Register controller
* @namespace thinkster.organizers.controllers
*/
(function () {
  'use strict';


  angular
    .module('trulii.activities.controllers')
    .controller('ActivityDashboardCtrl', ActivityDashboardCtrl);

  ActivityDashboardCtrl.$inject = ['$scope','Activity','activity'];
  /**
  * @namespace RegisterController
  */
  function ActivityDashboardCtrl($scope,Activity,activity) {





    var pc = this;
    pc.steps = {};

    //pc.detailsUpdated = _detailsUpdated;

    activate();

   
   

    pc.activitySectionUpdated = _checkSections;

    function _checkSections(activity){


        angular.forEach(activity.completed_steps,function(value,key){


            pc.steps[key] = value;
        });

    }

    function activate(){

        _checkSections(activity);

    }


    // $scope.isCollapsed = true;

    // function success(){ 

    //   $scope.isCollapsed   = false;

    //   var timer = $timeout(function() {
    //     $scope.isCollapsed = true;
    //   }, 1000);
    // }

    // function _update_info() {

    //   var data_info = {
    //     'name':$scope.organizer.name,
    //     'bio' :$scope.organizer.bio,
    //     'id'  :$scope.organizer.id
    //   }

    //   OrganizerService.update(data_info)
    //     .success(_updateSuccess)
    //     .error(_updateFail);
      
    // }


    // function _update_video() {

    //   var data_info = {
    //     'youtube_video_url':$scope.organizer.youtube_video_url,
    //     'id'  :$scope.organizer.id
    //   }

    //   OrganizerService.update(data_info)
    //     .success(_updateSuccess)
    //     .error(_updateFail);
      
    // }

    // function _updateSuccess(response){

    //   Authentication.updateAuthenticatedAccount();
    //   _toggleMessage();


    // }

    // function _updateFail(response){
    //     console.log(response);
    // }

    
    // function _successUploaded(data){

    //   Authentication.updateAuthenticatedAccount();

    //   $scope.photo_path    = data.photo;
    //   $scope.photo_invalid = false;
    //   $scope.photo_loading = false;

    // }

    // function _toggleMessage(){

    //   $scope.isCollapsed   = false;
    //   var timer = $timeout(function() {
    //     $scope.isCollapsed = true;
    //   }, 1000);
    // }

  };

  })();