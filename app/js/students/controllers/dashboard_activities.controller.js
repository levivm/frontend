/**
 * @ngdoc controller
 * @name trulii.students.controllers.StudentActivitiesCtrl
 * @description Handles Student Activities Dashboard
 * @requires student
 */

(function () {
    'use strict';

    angular
        .module('trulii.students.controllers')
        .controller('StudentActivitiesCtrl', StudentActivitiesCtrl);

    StudentActivitiesCtrl.$inject = ['$timeout', '$state', 'Authentication', 'activities'];

    function StudentActivitiesCtrl($timeout, $state, Authentication, activities) {

        var vm = this;
        vm.activities = null;

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

        function activate() {
            // If the user is authenticated, they should not be here.
            if (!(Authentication.isAuthenticated())) {
                $location.url('/');
            }

            vm.activities = activities.map(mapMainPicture);
            console.log(vm.activities);
        }

    }

})();