/**
* Register controller
* @namespace thinkster.organizers.controllers
*/
(function () {
  'use strict';


  angular
    .module('trulii.organizers.controllers')
    .controller('OrganizerProfileCtrl', OrganizerProfileCtrl);

  OrganizerProfileCtrl.$inject = ['$scope','$modal','$http','$location','$timeout','serverConf','Authentication','UploadFile','organizer'];
  /**
  * @namespace RegisterController
  */
  function OrganizerProfileCtrl($scope,$modal,$http,$location,$timeout,serverConf,Authentication,UploadFile,organizer) {

    var vm = this;


    
    vm.organizer    = angular.copy(organizer);


    vm.photo_path = vm.organizer.photo;
    vm.errors = {};
    vm.photo_invalid = false;
    vm.photo_loading = false;
    vm.isCollapsed   = true;

    vm.addImage = _uploadImage;



    //submit callbacks
    vm.submit_info  =  _update_info;

    vm.submit_video =  _update_video;
    

   


    //Private functions


    function _uploadImage(image){

      var url = serverConf.url+'/api/users/upload/photo/';
      UploadFile.upload_file(image,url)
          .then(_successUploaded,_erroredUpload,_progressUpload);

    }

    function _update_info() {

      vm.organizer.update_profile()
        .then(_updateSuccess,_updateFail);
        
      
    }


    function _update_video() {


      vm.organizer.update_video()
        .then(_updateSuccess,_updateFail);      
    }

    function _updateSuccess(){

      angular.extend(organizer,vm.organizer);
      //Authentication.updateAuthenticatedAccount();
      _toggleMessage();


    }

    function _updateFail(response){
      console.log("FAIL",response)
        console.log(response);
    }

    



    function _clearErrors(){
      vm.errors = null;
      vm.errors = {};
    }



    function _addError(field, message) {

      vm.errors[field] = message;

    };

    function _progressUpload(){
      vm.photo_loading = true;
    };


    function _erroredUpload(response) {

      vm.photo_loading = false;
      if (response['errors']) {
        vm.photo_invalid = true; 
        
        

        angular.forEach(response['errors'], function(errors) {

          _addError(errors.field,errors.errors[0]);   

        });

      }
    }

    function _successUploaded(response){
      angular.extend(organizer,vm.organizer);
      vm.photo_path    = response.data.photo;
      vm.photo_invalid = false;
      vm.photo_loading = false;

    }

    function _toggleMessage(){


      vm.isCollapsed   = false;
      var timer = $timeout(function() {
        vm.isCollapsed = true;
      }, 1000);
    }

  };

  })();