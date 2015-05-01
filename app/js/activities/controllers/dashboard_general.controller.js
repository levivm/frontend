/**
 * @ngdoc controller
 * @name trulii.activities.controllers.ActivityGeneralController
 * @description ActivityGeneralController
 * @requires ng.$scope
 */

(function () {
  'use strict';

  angular
      .module('trulii.activities.controllers')
      .controller('ActivityGeneralController', ActivityGeneralController);

  ActivityGeneralController.$inject = ['$scope','$modal','$http','$state','$timeout','$q','$stateParams','filterFilter',
    'Categories','activity', 'Elevator', 'Toast'];

  function ActivityGeneralController($scope,$modal,$http,$state,$timeout,$q,$stateParams,filterFilter,
                                     Categories,activity, Elevator, Toast) {

    var vm = this;

    vm.activity = angular.copy(activity);
    console.log('vm.activity.completed_steps:', activity.completed_steps);
    vm.selectCategory = _selectCategory;
    vm.setOverElement = _setOverElement;
    vm.getLevelClassStyle = getLevelClassStyle;

    initialize();

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
      _onSectionUpdated();
      vm.activity.update()
          .then(function(response){
            vm.isCollapsed = false;
            vm.isSaving = false;
            angular.extend(activity,vm.activity);
            Toast.generics.weSave();
          }, _errored);
    }

    function _showTooltip(element){
      return vm.currentOverElement == element;
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
          .then(_successLoadActivity)
          .then(_isReady);
      vm.save_activity = _updateActivity;
      vm.creating = false;
    }

    function _setCreate(){
      vm.save_activity = _createActivity;
      vm.creating = true;
      vm.activity.generalInfo().then(_setPreSaveInfo).then(_isReady);
    }

    function _setPreSaveInfo(data) {
      vm.selected_category = {};
      vm.selected_sub_category = {};
      vm.selected_level = {};

      //var data = data;
      var categories = new Categories(data.categories);
      vm.activity_categories = categories;
      vm.activity_sub_categories = data.subcategories;
      vm.activity_levels = data.levels;

      console.log('_setPreSaveInfo data: ', data);

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
      vm.selected_category = filterFilter(vm.activity_categories,{id:response.category_id})[0];
      vm.selected_sub_category = filterFilter(vm.activity_sub_categories,{id:response.sub_category})[0];
      vm.activity_tags = response.tags;
    }

    function _updateSelectedValues(){
      vm.activity.category = vm.selected_category.id;
      vm.activity.sub_category = vm.selected_sub_category.id;
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
    }

    function _errored(errors) {

      angular.forEach(errors, function(message,field) {
        _addError(field,message[0]);
      });

      vm.isSaving = false;
    }

    function _successCreation(response){
      vm.isSaving = false;

      if (vm.creating)
        $state.go('activities-edit.detail',{activity_id:response.id});

      Toast.generics.weSave("Un paso menos para publicar tu actividad");
    }

    function _isReady(data){
      vm.isReady = true;
    }

    function activate() {
      // If the user is authenticated, they should not be here.
    }

    /* Utils */

    function getLevelClassStyle(level){
      return {
        'btn-active': vm.selected_level.code == level.code,
        'btn-intermediate-level': level.code == 'I',
        'btn-advanced-level': level.code == 'A',
        'btn-beginner-level': level.code == 'P'
      };
    }

    function _onSectionUpdated(){
      var subSections = ['title', 'short_description', 'category', 'sub_category', 'level'];
      var isCompleted = subSections.every(function(subSection){
        console.log('activity[', subSection, ']: ', vm.activity.hasOwnProperty(subSection) && !!vm.activity[subSection]);
        return (vm.activity.hasOwnProperty(subSection) && !!vm.activity[subSection]);
      });
      activity.setSectionCompleted('general', isCompleted);
      console.log('_onSectionUpdated.vm.activity.completed_steps:', vm.activity.completed_steps);
    }

    function initialize(){

      vm.errors = {};
      vm.isCollapsed = true;
      vm.duration = 1;
      vm.isSaving = false;
      vm.isReady = false;

      Elevator.toTop();

      if (activity.id)
        _setUpdate();
      else
        _setCreate();

    }

  }

})();