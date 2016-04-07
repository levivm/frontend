/**
 * @ngdoc controller
 * @name trulii.activities.controllers.ActivityCalendarController
 * @description Handles Activity Calendar Actions
 * @requires ng.$scope
 * @requires ui.bootstrap.datepicker.datepickerPopupConfig
 * @requires trulii.authentication.services.Error
 * @requires calendar
 */

(function () {
    'use strict';

    angular
        .module('trulii.activities.controllers')
        .controller('ActivityCalendarController', ActivityCalendarController);

    ActivityCalendarController.$inject = ['$scope','$state', 'activity', 'CalendarsManager', 'Elevator', 'Error', 'datepickerPopupConfig', 'Toast', 'calendar', '$document', '$timeout'];

    function ActivityCalendarController($scope, $state, activity, CalendarsManager, Elevator, Error, datepickerPopupConfig, Toast, calendar, $document, $timeout) {

        var vm = this;
        vm.calendar = angular.copy(calendar);

        activate();

        ///////////////////////////

        function _createCalendar() {
            Error.form.clear(vm.activity_calendar_form);
            vm.calendar.create()
                .then(success, _errored);


            function success(calendar){

                //Change Save button functionality
                vm.save_calendar = _updateCalendar;
                // vm.extend(calendar,vm.calendar);
                CalendarsManager.setCalendar(calendar);
                _onSectionUpdated();

                vm.isCollapsed = false;
                vm.isSaving = false;

            }

        }

        function _updateCalendar() {
            Error.form.clear(vm.activity_calendar_form);
            vm.calendar.update()
                .then(success, _errored);

                function success(updatedCalendarData){

                    vm.isCollapsed = false;
                    angular.extend(calendar,vm.calendar);
                    CalendarsManager.setCalendar(updatedCalendarData);
                    _onSectionUpdated();

                    vm.isSaving = false;

                }
        }

        function _errored(responseErrors) {
            console.log(responseErrors);
            if (responseErrors) {
              if (responseErrors['sessions'] && !responseErrors['number_of_sessions']){
                    Error.form.addArrayErrors(vm.activity_calendar_form, responseErrors['sessions']);
                    Toast.error(vm.strings.TOAST_SESSIONS_ERROR);
                    delete responseErrors['sessions'];
                }

                if (responseErrors['number_of_sessions']){
                  Toast.error(vm.strings.TOAST_SESSIONS_NUMBER_ERROR);
                  delete responseErrors['number_of_sessions'];
                }
                if (!_.isEmpty(responseErrors)){
                    Elevator.toElement('activity_calendar_form');
                    Error.form.add(vm.activity_calendar_form, responseErrors);
                }

                // if responseErrors
            }

            vm.isSaving = false;
        }

        function _onSectionUpdated() {
            activity.load().then(function (data) {
                activity.updateSection('calendars');

            });
            $state.go("^", {'republish':null});

        }

        function _setStrings(){

            var LABEL_CALENDAR_TITLE = "Nuevo Calendario";
            if (vm.calendar.id)
                LABEL_CALENDAR_TITLE = "Calendario";


            if(!vm.strings){ vm.strings = {}; }
            angular.extend(vm.strings, {
                LABEL_CALENDARS: "Calendarios",
                LABEL_CALENDAR_TITLE: LABEL_CALENDAR_TITLE,
                COPY_CALENDAR_INFO: "Especifica precio, cupos y  fecha cierre de ventas de la clase.",
                LABEL_IS_FREE: "Habilitar inscripción gratuita",
                LABEL_START_DATE: "Fecha de inicio",
                LABEL_CLOSE_SALES: "Cierre de ventas",
                LABEL_CALENDAR_SEATS: "Cupos",
                LABEL_SESSION_PRICE: "Precio (COP)",
                PLACEHOLDER_SESSION_PRICE: "Precio Mínimo COP 30.000",
                TITLE_SESSIONS: "Sesiones",
                LABEL_SESSIONS_AMOUNT: "¿Cuántas sesiones o clases se realizarán?",
                LABEL_SESSION_DAY: "Día de la sesión",
                LABEL_SESSION_START_TIME: "Hora de inicio:",
                LABEL_SESSION_END_TIME: "Hora de fin:",
                TOAST_SESSIONS_ERROR: "Existe un error en las sesiones",
                TOAST_SESSIONS_NUMBER_ERROR: "Deber haber mínimo una sesión"

            });
        }

        function activate() {

            _setStrings();
            vm.isCollapsed = true;
            datepickerPopupConfig.showButtonBar = false;

            vm.formats = ['dd - MM - yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
            vm.format = vm.formats[0];

            vm.hstep = 1;
            vm.mstep = 15;

            vm.minStartDate = new Date();

            vm.dateOptions = {
                formatYear : 'yy',
                startingDay : 1,
                showWeeks: false
            };

            vm.ismeridian = true;

            vm.isSaving = false;

            if (vm.calendar.id)
                vm.save_calendar = _updateCalendar;
            else
                vm.save_calendar = _createCalendar;

            $scope.$watch(
              function(scope){
                return scope.calendar.calendar.number_of_sessions;
              },
              function(newValue, oldValue){
                if(newValue === 1){
                  $timeout(function(){
                    var scrollElement = angular.element(document.getElementById('calendar-0'));
                    $document.scrollToElementAnimated(scrollElement);
                  });
                }
              }
            );
        }
    }
})();
