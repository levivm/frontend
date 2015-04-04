/**
* Register controller
* @namespace thinkster.organizers.controllers
*/
(function () {
  'use strict';


  angular
    .module('trulii.activities.controllers')
    .controller('ActivityGeneralController', ActivityGeneralController);

  ActivityGeneralController.$inject = ['$scope','$modal','$http','$state','$timeout','$q','$stateParams','filterFilter','Categories','activity'];
  /**
  * @namespace ActivityGeneralController
  */
  function ActivityGeneralController($scope,$modal,$http,$state,$timeout,$q,$stateParams,filterFilter,Categories,activity) {


    var vm = this;

    initialize();

    vm.activity = angular.copy(activity);
    //vm.activity = activity;

    if (activity.id)
        _setUpdate();
    else
        _setCreate();

    vm.selectCategory = _selectCategory;

    vm.setOverElement = _setOverElement;




    /******************ACTIONS**************/


    function _selectCategory(category){

        console.log("category",category);
        vm.activity_sub_categories = category.subcategories;

    }

    function _createActivity() {
        _clearErrors();
        _updateTags();
        _updateSelectedValues();
        vm.activity.create()
            .success(_successCreation)
            .error(_errored);
    }
    
    function _updateActivity() {
        _clearErrors();
        _updateTags();
        _updateSelectedValues();
        vm.activity.update()
            .success(function(response){
                vm.isCollapsed = false;
                angular.extend(activity,vm.activity)

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



    function _setUpdate(){
        // vm.activity.load(activity_id)
        //     .then(,_loadActivityFail)
        vm.activity.generalInfo()
            .then(_setPreSaveInfo)
            .then(_successLoadActivity);
        vm.save_activity = _updateActivity;
        vm.creating = false;
    }


    function _setCreate(){
        //console.log("voy a crear");
        vm.save_activity = _createActivity;
        vm.creating = true;
        vm.activity.generalInfo().then(_setPreSaveInfo);


    }

    function _setPreSaveInfo(data) {
        vm.selected_category = {};
        vm.selected_sub_category = {};
        vm.selected_type = {};
        vm.selected_level = {};

        //var data = data;
        var categories = new Categories(data.categories);
        vm.activity_categories = categories;
        vm.activity_sub_categories = data.subcategories;
        vm.activity_types  = data.types;
        vm.activity_levels = data.levels;



        vm.loadTags = function(){
            var deferred = $q.defer();
                deferred.resolve(data.tags);
            return deferred.promise;
        };


        var deferred = $q.defer();
            deferred.resolve(vm.activity);
        return deferred.promise;

      
    }


    function _updateTags(){

        vm.activity.tags = [];
        angular.forEach(vm.activity_tags,function(value,index){

            vm.activity.tags.push(value.name);
        })
    }


    /*********RESPONSE HANDLERS***************/



    function _successLoadActivity(response){
        vm.selected_level = filterFilter(vm.activity_levels,{code:response.level})[0];
        vm.selected_type  = filterFilter(vm.activity_types,{code:response.type})[0];
        vm.selected_category = filterFilter(vm.activity_categories,{id:response.category_id})[0];
        vm.selected_sub_category = filterFilter(vm.activity_sub_categories,{id:response.sub_category})[0];
        vm.activity_tags = response.tags; 
    
    }




    function _updateSelectedValues(){
        vm.activity.category = vm.selected_category.id;
        vm.activity.sub_category = vm.selected_sub_category.id;
        vm.activity.type = vm.selected_type.code;
        vm.activity.level = vm.selected_level.code;


    }



    function _clearErrors(){
        vm.activity_create_form.$setPristine();
        vm.errors = null;
        vm.errors = {};
    }



    function _addError(field, message) {
      vm.errors[field] = message;
      vm.activity_create_form[field].$setValidity(message, false);

    };

    function _errored(errors) {
        angular.forEach(errors, function(message,field) {


          _addError(field,message[0]);   

        });

    }

    function _successCreation(response){
        $state.go('activities-edit.general',{activity_id:response.id});
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