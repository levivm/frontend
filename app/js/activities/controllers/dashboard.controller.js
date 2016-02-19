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

    ActivityDashboardCtrl.$inject = ['$state', '$scope', 'Toast', 'ActivitySteps', 'activity', 'Analytics'];

    function ActivityDashboardCtrl($state, $scope, Toast, ActivitySteps, activity, Analytics) {

        var pc = this;

        angular.extend(pc,{
            steps: angular.copy(ActivitySteps),
            activity: activity,
            sidebar: true,
            allow_unpublish: true,
            allow_publish: true,
            areAllStepsCompleted: areAllStepsCompleted,
            isSectionCompleted: isSectionCompleted,
            getCheckStyle: getCheckStyle,
            publish_activity: _publish_activity,
            unpublish_activity: _unpublish_activity,
            steps_left: activity.steps_left,
            scroll: 0,
            toggleSidebar: toggleSidebar,
            isActive: isActive,
            clickItemDashboard:clickItemDashboard
        });


        activate();

        function toggleSidebar(){
            pc.showSidebar = !pc.showSidebar;
            console.log('???0');
        }

        function isActive(stateStr){
            return $state.includes(stateStr);
        }

        function areAllStepsCompleted() {
            return activity.areAllStepsCompleted();
        }

        function isSectionCompleted(section) {
            return activity.isSectionCompleted(section);
        }

        function getCheckStyle(section) {

            var sectionIndex = _.indexOf(ActivitySteps, section);
            var classes = {};
            classes['bg-primary-' + (sectionIndex)] = pc.isSectionCompleted(section.name);

            return classes;
        }


        //Function Analytics data

        function clickItemDashboard(item){
            Analytics.organizerEvents.dashboardActivitiesItems(item);
        }

        //End Function Analytics data


        function _publish_activity() {
            pc.allow_publish = false;

            activity.publish().then(function (response) {

                $state.go('activities-detail',{'activity_id':pc.activity.id});
                Analytics.organizerEvents.publicActity(pc.activity.id);
                Toast.success(pc.strings.ACTIVITY_PUBLISHED);
                pc.allow_unpublish = true;
            },function(response){
                Toast.error(response.data.detail);
                pc.allow_publish = true;
            });
        }

        function _unpublish_activity() {
            pc.allow_unpublish = false;
            activity.unpublish().then(function (response) {

                Analytics.organizerEvents.unPublishActity(pc.activity.id);
                Toast.warning(pc.strings.UNPUBLISH_ACTIVITY_WARNING);
                pc.allow_publish = true;


            },function(response){
                Toast.error(response.data.detail);
                pc.allow_unpublish = true;
            });
        }



        function _setStrings(){

            if(!pc.strings){ pc.strings = {}; }

            pc.strings.UNPUBLISH_ACTIVITY_LABEL = "Desactivar";
            pc.strings.COPY_UNPUBLISH_ACTIVITY = "Remover publicación de los resultados de búsqueda";
            pc.strings.UNPUBLISH_ACTIVITY_WARNING = "Su actividad saldrá de los motores de búsqueda";
            pc.strings.PUBLISH_ACTIVITY_LABEL = "Publicar";
            pc.strings.ACTIVITY_PUBLISHED = "Actividad publicada";
            pc.strings.COPY_VIEW_ACTIVITY = "Visualizar";
            pc.strings.COPY_PRE_VIEW_ACTIVITY = "Previsualizar";

        }

        function _initScroll(){
            $scope.$on('scrolled',
              function(scrolled, scroll){
                pc.scroll = scroll;
                $scope.$apply();
              }
            );
        }


        function activate() {
            _setStrings();
            _initScroll();
            // pc.sidebar = true;
            activity.updateAllSections();

            match_required_steps(pc.steps, pc.activity.required_steps);

            function match_required_steps(steps, required_steps){
                _.each(steps, function(step){

                    if ( required_steps[step.name] !== undefined ){
                        step.required = true;
                    }
                });
            }
        }

    }

})();
