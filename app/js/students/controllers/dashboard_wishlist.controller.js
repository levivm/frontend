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

    StudentWishlistCtrl.$inject = ['$timeout', 'student', 'Authentication', 'Error', 'Toast', 'wishListActivities', 'LocationManager', '$state'];
    function StudentWishlistCtrl($timeout, student, Authentication, Error, Toast, wishListActivities, LocationManager, $state) {

        var vm = this;
        angular.extend(vm, {
            student : student,
            cards: [],
            activities: [],
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
            searchActivities: searchActivities
        });

        activate();

        //--------- Functions Implementation ---------//
        
        
        function searchActivities(){
            var searchCity = LocationManager.getSearchCity();
            $state.go('search', {'city': searchCity.id});
        }

        function updateByQuery(){
            student.getWishList(vm.nextPaginationOpts.pageNumber, vm.nextPaginationOpts.itemsPerPage)
            .then(function(response){
              vm.activities = response.results;
              vm.nextPaginationOpts.totalItems = response.count;
            });
        }

        function _setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }
            angular.extend(vm.strings, {
                TAB_WISHLIST: "Favoritos",
                COPY_WISHLIST: "Estas son tus actividades favoritas. No te despistes que en cualquiere momento se pueden agotar los cupos. ¿Qué esperas para insicribirte?",
                COPY_EMPTY_ACTIVITIES: "No tienes favoritos, comienza a buscar actividades ya",
                ACTION_SEARCH_ACTIVITY: "Buscar Actividad"
            });
        }

        function _setActivities(){

            vm.nextPaginationOpts.totalItems = wishListActivities.count;
            vm.activities = wishListActivities.results;
            console.log(vm.activities);

        }
        
        function _mapTemplates(){
             for(var i = 0; i < vm.activities.length; i++){
                vm.activities[i].template = "partials/activities/dynamic_layout_item.html";
            }
            vm.cards = vm.activities;
        }

        function activate() {
            _setStrings();
            _setActivities();
            _mapTemplates();
        }

    }

})();
