/**
 * @ngdoc controller
 * @name trulii.students.controllers.StudentDashboardCtrl
 * @description Handles Student Dashboard Main Component
 * @requires ui.router.state.$state
 */

(function () {
    'use strict';

    angular
        .module('trulii.students.controllers')
        .controller('StudentDashboardCtrl', StudentDashboardCtrl);

    StudentDashboardCtrl.$inject = ['$state', '$scope', 'Analytics'];

    function StudentDashboardCtrl($state, $scope, Analytics) {

        var vm = this;
        angular.extend(vm, {
            changeState : _changeState,
            isActive : isActive,
            scroll: 0,
            showSidebar: false,
            toggleSidebar: toggleSidebar,
            clickItem:clickItem
        });

        _activate();

        //--------- Exposed Functions ---------//

        function isActive(stateStr){
            return $state.includes(stateStr);
        }

        //--------- Internal Functions ---------//

        function _changeState(newState) {
            $state.go(newState);
        }

        function toggleSidebar(){
            console.log("???");
            console.log(vm.showSidebar);
            vm.showSidebar = !vm.showSidebar;
        }

        function clickItem(item){
            Analytics.studentEvents.dashboardItemClicks(item);
        }

        function setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }
            angular.extend(vm.strings, {
                SECTION_ACTIVITIES: "Actividades",
                SECTION_ACCOUNT: "Cuenta",
                SECTION_PROFILE: "Perfil",
                SECTION_HISTORY: "Transacciones"
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
            setStrings();
            _initScroll();
        }
    }

})();
