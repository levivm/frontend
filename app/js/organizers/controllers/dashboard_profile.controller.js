/**
* Register controller
* @namespace thinkster.organizers.controllers
*/
(function () {
  'use strict';


  angular
    .module('trulii.organizers.controllers')
    .controller('OrganizerProfileCtrl', OrganizerProfileCtrl);

  OrganizerProfileCtrl.$inject = ['$scope','$modal','$http','$location','$timeout','serverConf',
                  'filterFilter','uiGmapIsReady','Authentication','LocationManager','UploadFile',
                  'Toast','organizer','cities', 'Error'];
  /**
  * @namespace RegisterController
  */
  function OrganizerProfileCtrl($scope,$modal,$http,$location,$timeout,serverConf,
                  filterFilter,uiGmapIsReady,Authentication,LocationManager,UploadFile,Toast,
                  organizer,cities, Error) {

    var vm = this;


    
    vm.organizer    = angular.copy(organizer);
    vm.cities = cities;

    vm.photo_path = vm.organizer.photo;
    vm.errors = {};

    vm.photo_invalid = false;
    vm.photo_loading = false;
    vm.isCollapsed   = true;
    vm.load_map = initialize_map;

    vm.map = LocationManager.getMap(vm.organizer.location);
    
    vm.marker = LocationManager.getMarker(vm.organizer.location);

    vm.addImage = uploadImage;
  
    vm.submit_info  =  update_info;

    vm.submit_video =  update_video;

    vm.submit_location = update_location;

    vm.isSaving = false;
    


    /** TAB Photo and Video functions **/

    function uploadImage(image){

      vm.organizer.upload_photo(image)
          .then(_successUploaded,_erroredUpload,_progressUpload);

    }


    function update_video() {


      vm.organizer.update_video()
        .then(_updateSuccess,_updateFail);      
    }

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





    /** TAB Info functions **/

    function update_info() {

      vm.organizer.update_profile()
        .then(_updateSuccess,_updateFail);
        
      
    }


    /** TAB Location functions **/

    function update_location(){

      Error.form.clear(vm.profile_form_info);

      _setOrganizerPos();
      vm.organizer.update_location(vm.organizer.location)
        .then(_successUpdatedLocation,_updateFail)


    }


    function _successUpdatedLocation(response){

        angular.extend(organizer,vm.organizer);
        Toast.generics.weSaved();
    }

    function _setOrganizerPos(){
      vm.organizer.location.point = [];
      vm.organizer.location.point[1] = vm.marker.coords.latitude;
      vm.organizer.location.point[0] = vm.marker.coords.longitude;
    }


    function initialize_map(){

      uiGmapIsReady.promise(1).then(function(instances) {
          instances.forEach(function(inst) {

              var map = inst.map;
              google.maps.event.trigger(map, 'resize');
          });
      });
    }



    /** Common functions */

    function _updateSuccess(){

      angular.extend(organizer,vm.organizer);
      //Authentication.updateAuthenticatedAccount();
      _toggleMessage();

      vm.isSaving = false;
      Toast.generics.weSaved();


    }

    function _updateFail(response){

        var errors = response.data

        Error.form.add( vm.profile_form_info, errors);   

        vm.isSaving = false;     

    }

    function _toggleMessage(){


      vm.isCollapsed   = false;
      var timer = $timeout(function() {
        vm.isCollapsed = true;
      }, 1000);
    }

  };

  })();