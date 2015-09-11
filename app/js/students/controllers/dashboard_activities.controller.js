/**
 * @ngdoc controller
 * @name trulii.students.controllers.StudentActivitiesCtrl
 * @description Handles Student Activities Dashboard
 * @requires activities
 */

(function () {
    'use strict';

    angular
        .module('trulii.students.controllers')
        .controller('StudentActivitiesCtrl', StudentActivitiesCtrl);

    StudentActivitiesCtrl.$inject = ['activities'];

    function StudentActivitiesCtrl(activities) {

        var vm = this;
        angular.extend(vm, {
            open_activities: [],
            closed_activities: [],
            options : {
                actions: ["contact"]
            }
        });

        _activate();

        //--------- Exposed Functions ---------//

        //--------- Internal Functions ---------//

        function _assignActivities(){
            console.log('Dashboard activities:', activities);
            vm.open_activities = [];
            vm.closed_activities = [];
            angular.forEach(activities, filterActivity);

            function filterActivity(activity){
                if(activity.last_date < Date.now()){
                    vm.closed_activities.push(activity);
                } else {
                    vm.open_activities.push(activity);
                }
            }
        }

        function _mapMainPicture(activity){
            angular.forEach(activity.photos, function(photo, index, array){
                if(photo.main_photo){
                    activity.main_photo = photo.photo;
                }

                if( index === (array.length - 1) && !activity.main_photo){
                    activity.main_photo = array[0].photo;
                }
            });

            return activity;
        }

        function _setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }
            angular.extend(vm.strings, {
                ACTION_SEARCH_ACTIVITIES: "Buscar Actividades",
                COPY_CURRENT: "Revisa las actividades que estás cursando actualmente o que inician próximamente.",
                COPY_HISTORY: "Revisa las actividades en las que te has inscrito anteriormente.",
                SECTION_ACTIVITIES: "Mis Actividades",
                LABEL_EMPTY_ACTIVITIES: "Hasta ahora no se ha inscrito en alguna actividad",
                COPY_EMPTY_ACTIVITIES: "Parece ser el momento perfecto para que descubra una nueva pasión, aprenda un nuevo pasatiempo o mejore su currículo",
                TAB_OPEN: "Abiertas",
                TAB_CLOSED: "Cerradas"
            });
        }

        function _activate() {
            _setStrings();
            activities = activities ? activities.map(_mapMainPicture) : [] ;
            _assignActivities();
        }

    }

})();