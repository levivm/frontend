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

  ActivityDashboardCtrl.$inject = ['$scope','Activity','activity'];

  function ActivityDashboardCtrl($scope,Activity,activity) {

    var pc = this;

    pc.all_steps_completed = false;
    pc.steps = {};
    pc.activity = activity;
    pc.sidebar = false;

    pc.publish_activity = _publish_activity;
    pc.activitySectionUpdated = _checkSections;

    activate();
    initialize();

    console.log('ActivityDashboardCtrl. Activity.generalInfo()');

    function _publish_activity(){
        activity.publish().then(function(response){
            console.log("actividad publicada");
        });
    }

    function _checkSections(activity){
        var all_completed = true;
        angular.forEach(activity.completed_steps,function(value,key){
            pc.steps[key] = value;
            if(!(value))
                all_completed = false;
        });

        pc.all_steps_completed = all_completed
    }

    function activate(){
        _checkSections(activity);
    }

    function initialize(){
      pc.sidebar = true;
    }
  }

  })();