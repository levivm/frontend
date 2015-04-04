/**
* Register controller
* @namespace thinkster.organizers.controllers
*/
(function () {
  'use strict';


  angular
    .module('trulii.organizers.controllers')
    .controller('OrganizerDashboardCtrl', OrganizerDashboardCtrl);

  OrganizerDashboardCtrl.$inject = ['$scope','$state'];
  /**
  * @namespace RegisterController
  */
  function OrganizerDashboardCtrl($scope,$state) {


    $scope.changeState = _changeState;

    function _changeState(newState){
        $state.go(newState);
    }

    //activate();

    // $scope.organizer  = Authentication.getAuthenticatedAccount();
    // $scope.photo_path = $scope.organizer.photo;
    // $scope.errors = {};
    // $scope.photo_invalid = false;
    // $scope.photo_loading = false;
    // $scope.isCollapsed   = true;

    // $scope.$watch('organizer.photo', function(old_value,new_value) {

    //   if (old_value!=new_value){ 
        
    //     $scope.upload = UploadFile.upload_file($scope.organizer.photo)
    //       .progress(_progressUpload)
    //       .success(_successUploaded)
    //       .error(_erroredUpload);
    //   }

    // });

    // //submit callbacks
    // $scope.submit_info  =  _update_info;

    // $scope.submit_video =  _update_video;
    




    // //Private functions

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

    
    // function activate() {
    //   // If the user is authenticated, they should not be here.
    //   if (!(Authentication.isAuthenticated())) {
    //     $location.url('/');
    //   }
    // }



    // function _clearErrors(){
    //   $scope.errors = null;
    //   $scope.errors = {};
    // }



    // function _addError(field, message) {

    //   $scope.errors[field] = message;

    // };

    // function _progressUpload(){
    //   $scope.photo_loading = true;
    // };


    // function _erroredUpload(response) {


    //   if (response['errors']) {
    //     $scope.photo_invalid = true;
        
        

    //     angular.forEach(response['errors'], function(errors) {

    //       _addError(errors.field,errors.errors[0]);   

    //     });

    //   }
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