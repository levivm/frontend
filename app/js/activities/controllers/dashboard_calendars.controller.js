/**
 * @ngdoc controller
 * @name trulii.activities.controllers.ActivityCalendarsController
 * @description ActivityCalendarsController
 * @requires ng.$scope
 * @requires trulii.activities.services.Activity
 * @requires activity
 */

(function () {
    'use strict';

    angular
        .module('trulii.activities.controllers')
        .controller('ActivityCalendarsController', ActivityCalendarsController);

    ActivityCalendarsController.$inject = ['$scope', '$state', '$stateParams', '$filter', '$modal',
        'CalendarsManager','Toast','activity', 'calendars'];

    function ActivityCalendarsController($scope, $state, $stateParams, $filter, $modal,
                                         CalendarsManager,Toast, activity, calendars) {

        var vm = this;
        vm.calendars = calendars;

        setStrings();
        initialize();

        vm.createCalendar = _createCalendar;
        vm.loadCalendar = _loadCalendar;
        vm.setCalendar = _setCalendar;
        vm.deleteCalendar = _deleteCalendar;

        function _createCalendar() {
            $state.go(".detail");
        }

        function _loadCalendar(calendar) {
            $state.go(".detail", {'id' : calendar.id});
        }

        function _setCalendar(calendar) {
            CalendarsManager.setCalendar(calendar);
            activity.load().then(function (data) {
                _onSectionUpdated();
            });

            $state.go("^");
        }

        function _deleteCalendar(calendar) {


            if (activity.hasAssistants()){
                Toast.error(vm.strings.DELETE_CALENDAR_ERROR);
                return
            }


            var modalInstance = $modal.open({
                templateUrl : 'partials/activities/messages/confirm_delete_calendar.html',
                controller : 'ModalInstanceCtrl',
                size : 'lg'
            });

            modalInstance.result.then(function () {

                CalendarsManager.deleteCalendar(calendar.id)
                    .then(_successDelete, _errorDelete);

            });

            function _successDelete(response) {
                activity.load().then(function (data) {
                    _onSectionUpdated();
                });
            }

            function _errorDelete(response) {

                vm.calendar_errors = {};

                if(response.detail){
                    Toast.error(response.detail);
                    return
                }

                angular.forEach(response, function (value, key) {
                    vm.calendar_errors[key] = value;
                })

            }
        }

        function _onSectionUpdated() {
            activity.updateSection('calendars');
        }

        function initialize() {
            vm.calendar_errors = {};
            _onSectionUpdated();
        }
        function setStrings(){
            if(!vm.strings){ vm.strings = {}; }
            angular.extend(vm.strings, {
                DELETE_CALENDAR_ERROR : "No puede eliminar este calendario, tiene estudiantes inscritos"
            });
        }


    }

})();