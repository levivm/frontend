/**
 * @ngdoc controller
 * @name trulii.activities.controllers.ActivityDashboardCtrl
 * @description ActivityDashboardCtrl
 * @requires ng.$scope
 * @requires trulii.activities.services.Activity
 * @requires trulii.activities.services.ActivitySteps
 * @requires activity
 */

(function () {
    'use strict';

    angular
        .module('trulii.activities.controllers')
        .controller('ActivityDashboardCtrl', ActivityDashboardCtrl);

    ActivityDashboardCtrl.$inject = ['$scope','$state', 'Activity','Toast', 'ActivitySteps', 'activity'];

    function ActivityDashboardCtrl($scope,$state, Activity,Toast, ActivitySteps, activity) {

        var pc = this;

        pc.steps = ActivitySteps;
        pc.activity = activity;
        pc.sidebar = false;
        pc.allow_unpublish = true;
        pc.allow_publish = true;
        pc.areAllStepsCompleted = areAllStepsCompleted;
        pc.isSectionCompleted = isSectionCompleted;
        pc.getCheckStyle = getCheckStyle;
        pc.publish_activity = _publish_activity;
        pc.unpublish_activity = _unpublish_activity;
        pc.steps_left = activity.steps_left;
        

        pc.strings = {};
        pc.strings.UNPUBLISH_ACTIVITY_LABEL = "Desactivar";
        pc.strings.UNPUBLISH_ACTIVITY_WARNING = "Su actividad saldrá de los motores de búsqueda";
        pc.strings.PUBLISH_ACTIVITY_LABEL = "Publicar";
        pc.strings.ACTIVITY_PUBLISHED = "Actividad publicada";


        activate();
        initialize();

        function areAllStepsCompleted() {
            return activity.areAllStepsCompleted();
        }

        function isSectionCompleted(section) {
            return activity.isSectionCompleted(section);
        }

        function getCheckStyle(section) {
            // console.log("APPLYING STYLE",pc.isSectionCompleted(section),section);

            var sectionIndex = _.indexOf(ActivitySteps, section);     

            var classes = {};
            classes['bg-primary-' + (sectionIndex)] = pc.isSectionCompleted(section.name);

            return classes;
        }

        function _publish_activity() {
            pc.allow_publish = false;

            activity.publish().then(function (response) {

                if(pc.activity.isFirstEdit())
                    $state.go('activities-detail',{'activity_id':pc.activity.id});
                
                Toast.success(pc.strings.ACTIVITY_PUBLISHED);
                pc.allow_unpublish = true;
            },function(response){
                Toast.error(response.data.detail)
                pc.allow_publish = true;
            })
        }

        function _unpublish_activity() {
            pc.allow_unpublish = false;
            activity.unpublish().then(function (response) {
                
                Toast.warning(pc.strings.UNPUBLISH_ACTIVITY_WARNING);
                pc.allow_publish = true;

            },function(response){
                Toast.error(response.data.detail)
                pc.allow_unpublish = true;
            })
        }


        function activate() {

        }

        function initialize() {
            pc.sidebar = true;
        }

    }

})();