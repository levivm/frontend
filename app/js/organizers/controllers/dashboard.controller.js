/**
 * @ngdoc controller
 * @name trulii.organizers.controllers.OrganizerDashboardCtrl
 * @description Handles Organizer Dashboard
 * @requires ui.router.state.$state
 */

(function () {
    'use strict';

    angular
        .module('trulii.organizers.controllers')
        .controller('OrganizerDashboardCtrl', OrganizerDashboardCtrl);

    OrganizerDashboardCtrl.$inject = ['$state', '$scope', '$window', 'unreadReviewsCount',];
    function OrganizerDashboardCtrl($state, $scope, $window, unreadReviewsCount) {

        var vm = this;
        angular.extend(vm, {
            isActive: isActive,
            unreadReviewsCount: unreadReviewsCount,
            scroll: 0,
        });


        _activate();

        function isActive(stateStr){
            return $state.includes(stateStr);
        }

        function _setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }
            angular.extend(vm.strings, {
                SECTION_PROFILE: "Perfil",
                SECTION_ACCOUNT: "Cuenta",
                SECTION_ACTIVITIES: "Actividades",
                SECTION_INSTRUCTORS: "Instructores",
                SECTION_REVIEWS: "Comentarios",
                SECTION_TRANSACTIONS: "Transacciones"
            });
        }

        function _initScroll(){
            $scope.$on('scrolled',
              function(scrolled, scroll){
                vm.scroll = scroll;
                $scope.$apply();
              }
            );
        }

        function _activate() {
            _setStrings();
            _initScroll();
        }

    }

})();
