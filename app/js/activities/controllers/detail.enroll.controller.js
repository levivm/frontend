(function () {
    'use strict';

    angular
        .module('trulii.activities.controllers')
        .controller('ActivityDetailEnrollController', ActivityDetailEnrollController);

    ActivityDetailEnrollController.$inject = ['$state', 'ActivitiesManager', 'Authentication', 'activity', 'calendar', 'Toast'];

    function ActivityDetailEnrollController($state, ActivitiesManager, Authentication, activity, calendar, Toast) {
        var pc = this;
        pc.minus = minus;
        pc.plus = plus;
        pc.enroll = enroll;
        pc.isAnonymous = isAnonymous;

        initialize();

        function minus() {
            if (pc.quantity > 1) {
                pc.quantity -= 1;
                pc.assistants.pop();
                _calculateAmount();
            }
        }

        function plus() {
            if (pc.quantity + pc.calendar.assistants.length < pc.capacity) {
                pc.quantity += 1;
                pc.assistants.push({});
                _calculateAmount();
            } else {
                Toast.warning('El máximo de cupos disponibles es ' + pc.quantity);
            }
        }

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

        function isAnonymous(){
            return Authentication.isAnonymous();
        }

        function _clearErrors() {
            pc.enrollForm.$setPristine();
            pc.errors = {};
        }

        function _addError(field, message) {
            pc.errors[field] = message;
        }

        function _error(errors){
            console.log(errors);
            angular.forEach(errors, function (message, field) {
                console.log('message', message);
                console.log('field', field);
                _addError(field, message);
            })
        }

        function initialize(){
            pc.stateInfo = {
                from: {
                    state : $state.current.name,
                    params : $state.params
                }
            };

            pc.errors = {};
            pc.capacity = calendar.capacity;
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

            console.log(activity);
            console.log(calendar);
            console.log($state);
        }
    }
})();