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
        vm.activities = null;
        vm.options = {
            actions: ["view", "contact"]
        };

        activate();

        function mapMainPicture(activity){
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

        function setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }
            angular.extend(vm.strings, {
                COPY_CURRENT: "Revisa las actividades que estás cursando actualmente o que inician próximamente.",
                COPY_HISTORY: "Revisa las actividades en las que te has inscrito anteriormente.",
                SECTION_ACTIVITIES: "Mis Actividades",
                LABEL_EMPTY_ORDERS: "Hasta ahora no se ha inscrito en algun actividad",
                COPY_EMPTY_ORDERS: "Parece ser el momento perfecto para que descubra una nueva pasión, aprenda un nuevo pasatiempo o mejore su currículo",
                TAB_CURRENT: "Actuales",
                TAB_HISTORY: "Anteriores"
            });
        }

        function activate() {        

            setStrings();
            vm.activities = activities ? activities.map(mapMainPicture) : [] ;
        }

    }

})();