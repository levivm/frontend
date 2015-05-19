(function () {
    'use strict';

    angular
        .module('trulii.activities.controllers')
        .controller('ActivityDetailEnrollController', ActivityDetailEnrollController);

    ActivityDetailEnrollController.$inject = ['$state', 'ActivitiesManager', 'activity', 'calendar'];

    function ActivityDetailEnrollController($state, ActivitiesManager, activity, calendar) {
        var pc = this;

        pc.calendar_selected = null;
        //pc.changeCalendarSelected = changeCalendarSelected;
        pc.minus = minus;
        pc.plus = plus;
        pc.enroll = enroll;

        initialize();

        function minus() {
            if (pc.quantity > 1) {
                pc.quantity -= 1;
                pc.assistants.pop();
                _calculateAmount();
            }
        }

        function plus() {
            if (pc.quantity + pc.calendar.assistants.length <= pc.capacity) {
                pc.quantity += 1;
                pc.assistants.push({});
                _calculateAmount();
            }
        }

        //function changeCalendarSelected(calendar) {
        //    pc.calendar_selected = calendar;
        //}

        function enroll() {
            _clearErrors();

            var student_data = JSON.parse(localStorage.getItem('ls.user'));

            var data = {
                chronogram: calendar.id,
                student: student_data.id,
                amount: pc.quantity * calendar.session_price,
                quantity: pc.quantity,
                assistants: pc.assistants
            };

            ActivitiesManager.enroll(activity.id, data)
                .success(_successCreation)
                .error(_error);
        }

        function initialize(){
            pc.errors = {};
            pc.capacity = calendar.capacity > 10;
            pc.amount = calendar.session_price;

            if(isAllBooked()){
                pc.quantity = 0;
                pc.assistants = [];
            } else {
                pc.quantity = 1;
                pc.assistants = [{}];
            }

            pc.calendar = calendar;
            pc.activity = activity;
            pc.success = false;
            pc.calendar_selected = activity.chronograms[0];

            console.log(activity);
            console.log(calendar);
        }

        function _clearErrors() {
            pc.enrollForm.$setPristine();
            pc.errors = {};
        }

        function _addError(field, message) {
            pc.errors[field] = message;
        }

        function _error(errors){
            angular.forEach(errors, function (message, field) {
                console.log('message', message);
                console.log('field', field);
                _addError(field, message);
            })
        }

        function _successCreation(response) {
            calendar.addAssistants(response.assistants);
            pc.success = true;
            $state.go('activities-enroll.success');
        }

        function _calculateAmount() {
            pc.amount = pc.quantity * calendar.session_price;
        }

        function isAllBooked(){
            return calendar.capacity <= calendar.assistants.length;
        }
    }
})();