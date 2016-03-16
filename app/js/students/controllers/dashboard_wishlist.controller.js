/**
 * @ngdoc controller
 * @name trulii.students.controllers.StudentWishlistCtrl
 * @description Handles Student Wishlist Dashboard
 * @requires student
 * @requires trulii.authentication.services.Authentication
 * @requires trulii.authentication.services.Error
 */

(function () {
    'use strict';

    angular
        .module('trulii.students.controllers')
        .controller('StudentWishlistCtrl', StudentWishlistCtrl);

    StudentWishlistCtrl.$inject = ['$timeout', 'student', 'Authentication', 'Error', 'Toast', 'currentActivities'];
    function StudentWishlistCtrl($timeout, student, Authentication, Error, Toast, currentActivities) {

        var vm = this;
        angular.extend(vm, {
            student : student,
            future_activities: [],
            past_activities: [],
            nextPaginationOpts: {
                totalItems: 0,
                itemsPerPage: 12,
                maxPagesSize:12,
                pageNumber: 1
            },
            pastPaginationOpts: {
              totalItems: 0,
              itemsPerPage: 12,
              maxPagesSize:12,
              pageNumber: 1
            },
            currentPaginationOpts: {
              totalItems: 0,
              itemsPerPage: 12,
              maxPagesSize:12,
              pageNumber: 1
            },
            updateByQuery:updateByQuery,
            TYPE_NEXT: 'next'
        });

        activate();

        //--------- Functions Implementation ---------//


        function updateByQuery(type){
            switch(type){
                case vm.TYPE_NEXT:
                  student.getWishList(vm.TYPE_NEXT, vm.nextPaginationOpts.pageNumber, vm.nextPaginationOpts.itemsPerPage)
                  .then(function(response){
                    vm.future_activities = response.results;
                    vm.nextPaginationOpts.totalItems = response.count;
                  });
                  break;
                case vm.TYPE_PAST:
                  student.getWishList( vm.TYPE_PAST, vm.pastPaginationOpts.pageNumber, vm.pastPaginationOpts.itemsPerPage)
                  .then(function(response){
                    vm.past_activities = response.results;
                    vm.pastPaginationOpts.totalItems = response.count;
                  });
                  break;
                case vm.TYPE_CURRENT:
                  student.getWishList( vm.TYPE_CURRENT, vm.currentPaginationOpts.pageNumber, vm.currentPaginationOpts.itemsPerPage)
                  .then(function(response){
                    vm.current_activities = response.results;
                    vm.currentPaginationOpts.totalItems = response.count;
                  });
                  break;
            }
        }

        function _setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }
            angular.extend(vm.strings, {
                COPY_WISHLIST: "Favoritos",
            });
        }

        function _setActivities(){

            vm.nextPaginationOpts.totalItems = currentActivities.count;
            vm.future_activities = currentActivities.results;
            console.log(vm.future_activities);

        //    vm.pastPaginationOpts.totalItems = pastActivities.count;
            //vm.past_activities = pastActivities.results;

            //vm.currentPaginationOpts.totalItems = currentActivities.count;
            //vm.current_activities = currentActivities.results;

        }

        function activate() {
            _setStrings();
            _setActivities();
        }

    }

})();
