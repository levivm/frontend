(function () {
    'use strict';

    angular
        .module('trulii.activities.controllers')
        .controller('ActivityDetailEnrollController', ActivityDetailEnrollController);

    ActivityDetailEnrollController.$inject = ['$state', 'ActivitiesManager', 'activity', 'calendar'];

    function ActivityDetailEnrollController($state, ActivitiesManager, activity, calendar) {
        var vm = this;

        initialize();

        vm.getCapacity = function () {
            return new Array(vm.capacity)
        };

        vm.minus = function () {
            if (vm.quantity > 1) {
                vm.quantity -= 1;
                vm.assistants.pop();
            }
        };

        vm.plus = function () {
            if (vm.quantity < vm.capacity) {
                vm.quantity += 1;
                vm.assistants.push({});
            }
        };

        vm.enroll = function () {
            _clearErrors();

            var student_data = JSON.parse(localStorage.getItem('ls.user'));

            var data = {
                activity: activity.id,
                student: student_data.id,
                amount: vm.quantity * calendar.session_price,
                quantity: vm.quantity,
                assistants: vm.assistants
            };

            ActivitiesManager.enroll(activity.id, data)
                .success(_successCreation)
                .error(_error);
        };

        function initialize(){
            vm.errors = {};
            vm.capacity = calendar.capacity > 10 ? 10 : calendar.capacity;
            vm.quantity = 1;
            vm.assistants = [{}];
            vm.amount = calendar.session_price;

            vm.calendar = calendar;
            vm.activity = activity;
        }

        function _clearErrors() {
            vm.enrollForm.$setPristine();
            vm.errors = {};
        }

        function _addError(field, message) {
            vm.errors[field] = message;
        }

        function _error(errors){
            angular.forEach(errors, function (message, field) {
                console.log('message', message);
                console.log('field', field);
                _addError(field, message);
            })
        }

        function _successCreation(response) {
            //$state.go('')
        }
    }
})();