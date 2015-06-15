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

    ActivityCalendarController.$inject = ['$scope', 'datepickerPopupConfig', 'Error', 'calendar'];

    function ActivityCalendarController($scope, datepickerPopupConfig, Error, calendar) {

        var vm = this;
        vm.calendar = calendar;

        activate();

        ///////////////////////////

        function activate() {
            vm.isCollapsed = true;
            datepickerPopupConfig.showButtonBar = false;

            vm.formats = ['dd - MM - yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
            vm.format = vm.formats[0];

            vm.hstep = 1;
            vm.mstep = 15;

            vm.minStartDate = new Date();

            vm.dateOptions = {
                formatYear : 'yy',
                startingDay : 1
            };

            vm.errors = {};

            vm.ismeridian = true;

            vm.isSaving = false;

            if (vm.calendar.id)
                vm.save_calendar = _updateCalendar;
            else
                vm.save_calendar = _createCalendar;
        }

        function _createCalendar() {

            vm.errors = Error.form.clear(vm.activity_calendar_form, vm.errors);

            console.log(vm.calendar, "dd");
            vm.calendar.create()
                .then(_successCreated, _errored);

        }

        function _updateCalendar() {

            vm.errors = Error.form.clear(vm.activity_calendar_form, vm.errors);
            console.log(vm.calendar, "dd");
            vm.calendar.update()
                .then(_successUpdate, _errored);

        }

        function _addError(field, message) {
            console.log("field error", field, message);
            vm.errors[field] = message;

            //Non-field validation
            if (field === "non_field_errors")
                return;
            //End Non-field validation

            //Form validation
            var valid_form_field = vm.activity_calendar_form[field] ? vm.activity_calendar_form[field] : false;
            if (valid_form_field) {
                valid_form_field.$setValidity(message, false);
            }
            //End Form validation
        }

        function _errored(responseErrors) {
            if (responseErrors) {
                vm.errors = Error.form.add(form, vm.errors, responseErrors);
            }

            vm.isSaving = false;
        }

        function _successCreated(calendar) {
            vm.save_calendar = _updateCalendar;
            vm.isCollapsed = false;
            $scope.$parent.vm.setCalendar(calendar);

            vm.isSaving = false;
        }

        function _successUpdate(calendar) {
            vm.isCollapsed = false;
            $scope.$parent.vm.setCalendar(calendar);

            vm.isSaving = false;
        }
    }
})();