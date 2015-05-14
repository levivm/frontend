(function () {
    'use strict';

    angular
        .module('trulii.activities.controllers')
        .controller('ActivityDetailEnrollController', ActivityDetailEnrollController);

    ActivityDetailEnrollController.$inject = ['$state', 'ActivitiesManager', 'activity', 'calendar'];

    function ActivityDetailEnrollController($state, ActivitiesManager, activity, calendar) {
        var pc = this;

        initialize();

        pc.getCapacity = function () {
            return new Array(pc.capacity)
        };

        pc.minus = function () {
            if (pc.quantity > 1) {
                pc.quantity -= 1;
                pc.assistants.pop();
                _calculateAmount();
            }
        };

        pc.plus = function () {
            console.log("clicning",pc.quantity,pc.capacity);
            if (pc.quantity < pc.capacity) {
                pc.quantity += 1;
                pc.assistants.push({});
                _calculateAmount();
            }
        };

        pc.enroll = function () {
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
        };

        function initialize(){
            pc.errors = {};
            pc.capacity = calendar.capacity > 10 ? 10 : calendar.capacity;
            pc.quantity = 1;
            pc.assistants = [{}];
            pc.amount = calendar.session_price;

            pc.calendar = calendar;
            pc.activity = activity;
            pc.success = false;


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
    }
})();