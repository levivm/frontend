/**
 * @ngdoc controller
 * @name trulii.activities.controllers.ActivityDashboardCtrl
 * @description ActivityGeneralController
 * @requires ng.$scope
 * @requires trulii.activities.services.Activity
 * @requires activity
 */

(function () {
  'use strict';

  angular
    .module('trulii.activities.controllers')
    .controller('ActivityDashboardCtrl', ActivityDashboardCtrl);

  ActivityDashboardCtrl.$inject = ['$scope', 'Activity', 'ActivitySteps', 'activity'];

  function ActivityDashboardCtrl($scope, Activity, ActivitySteps, activity) {

    var pc = this;

      console.log(ActivitySteps);

    pc.steps = ActivitySteps;
    pc.activity = activity;
    pc.sidebar = false;
    pc.areAllStepsCompleted = areAllStepsCompleted;
    pc.isSectionCompleted = isSectionCompleted;
    pc.getCheckStyle = getCheckStyle;
    pc.publish_activity = _publish_activity;

    activate();
    initialize();

    function areAllStepsCompleted(){
        return activity.areAllStepsCompleted();
    }

    function isSectionCompleted(section) {
        return activity.isSectionCompleted(section);
    }

    function getCheckStyle(section){
        return { 'hide' : !pc.isSectionCompleted(section) };
    }

    function _publish_activity(){
        activity.publish().then(function(response){
            console.log("actividad publicada");
        });
    }

    function activate(){

    }

    function initialize(){
      pc.sidebar = true;
    }

  }

})();