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

    pc.all_steps_completed = false;
    pc.steps = {};
    pc.activity = activity;
    pc.publish_activity = _publish_activity;

    pc.sidebar = false;

    activate();
    initilize();


    pc.activitySectionUpdated = _checkSections;

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

    function initilize(){
      pc.sidebar = true;
    }



  };

  })();