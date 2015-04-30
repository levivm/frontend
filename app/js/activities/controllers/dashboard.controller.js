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

  ActivityDashboardCtrl.$inject = ['$scope', 'Activity', 'activity'];

  function ActivityDashboardCtrl($scope, Activity, activity) {

    var pc = this;

    pc.areAllStepsCompleted = function(){ return activity.areAllStepsCompleted(); };
    pc.steps = function(){ return activity.completed_steps; }();
    pc.isSectionCompleted = function(section) { return activity.isSectionCompleted(section); };
    pc.activity = activity;
    pc.sidebar = false;

    pc.publish_activity = _publish_activity;

    activate();
    initialize();

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