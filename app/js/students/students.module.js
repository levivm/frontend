/**
 * @ngdoc overview
 * @name trulii.students
 * @description
 * Students Module
 */
(function () {
    'use strict';

    angular
        .module('trulii.students', [
            'trulii.students.controllers',
            'trulii.students.services'
        ])
        .config(config);

    angular
        .module('trulii.students.controllers', ['angularFileUpload']);

    angular
        .module('trulii.students.services', []);

    //noinspection JSValidateJSDoc
    /**
     * @ngdoc object
     * @name trulii.students.config
     * @description Students Module Config function
     * @requires ui.router.state.$stateProvider
     */
    config.$inject = ['$stateProvider'];
    function config($stateProvider) {
        $stateProvider
            .state('student-dashboard', {
                abstract:true,
                url:'/students/dashboard/',
                controller: 'StudentDashboardCtrl as dash',
                templateUrl: 'partials/students/dashboard.html',
                resolve:{
                    cities:getAvailableCities,
                    student: getCurrentStudent
                },
                data: {
                    requiredAuthentication : true
                }
            })
            .state('student-dashboard.account', {
                url:'account',
                controller: 'StudentAccountCtrl as account',
                templateUrl: 'partials/students/dashboard_account.html'
            })
            .state('student-dashboard.profile', {
                url:'profile',
                controller: 'StudentProfileCtrl as profile',
                templateUrl: 'partials/students/dashboard_profile.html'
            })
            .state('student-dashboard.activities', {
                url:'activities',
                controller: 'StudentActivitiesCtrl as activities',
                templateUrl: 'partials/students/dashboard_activities.html',
                resolve:{
                    activities: getStudentActivities
                }
            })
            .state('student-dashboard.history', {
                url:'history',
                controller: 'StudentHistoryCtrl as history',
                templateUrl: 'partials/students/dashboard/history.html'
            })
            .state('student-dashboard.history.orders', {
                url:'/orders',
                templateUrl: 'partials/students/dashboard/history.orders.html'
            })
            .state('student-dashboard.history.orders.order', {
                url:'/:orderId',
                controller: 'StudentHistoryOrderCtrl as order',
                templateUrl: 'partials/students/dashboard/history.order.html',
                resolve: {
                    order: getOrder
                }
            })
            .state('student-dashboard.history.reimbursements', {
                url:'/reimbursements',
                templateUrl: 'partials/students/dashboard/history.reimbursements.html'
            });

        /**
         * @ngdoc method
         * @name .#getCurrentStudent
         * @description Retrieves the current logged Student from
         * {@link trulii.students.services.StudentsManager StudentsManager} Service otherwise returns ``null``
         * @requires ng.$timeout
         * @requires ui.router.state.$state
         * @requires ng.$q
         * @requires trulii.students.services.StudentsManager
         * @methodOf trulii.students.config
         */
        getCurrentStudent.$inject = ['$timeout', '$state', '$q', 'StudentsManager'];
        function getCurrentStudent($timeout, $state, $q, StudentsManager){

            return StudentsManager.getCurrentStudent().then(success, error);

            function success(student){
                if(student){
                    return student;
                } else {
                    $timeout(function() { $state.go('home'); });
                    return $q.reject();
                }
            }

            function error(response){
                if(response === null){
                    console.error("getCurrentStudent. There is no Authenticated User");
                } else {
                    console.warn("getCurrentStudent. The Authenticated User is not a Student");
                }
                return $q.reject();
            }
        }

        /**
         * @ngdoc method
         * @name .#getStudentActivities
         * @description Retrieves all Activities from
         * {@link trulii.students.services.StudentsManager StudentsManager} Service
         * for the specified Student ID
         * @requires trulii.activities.services.ActivitiesManager
         * @requires trulii.students.services.StudentsManager
         * @methodOf trulii.students.config
         */
        getStudentActivities.$inject = ['ActivitiesManager', 'StudentsManager'];
        function getStudentActivities(ActivitiesManager, StudentsManager){
            return StudentsManager.getCurrentStudent().then(success, error);

            function success(student){
                return ActivitiesManager.getStudentActivities(student.id);
            }

            function error(){
                $q.reject();
            }
        }

        /**
         * @ngdoc method
         * @name .#getAvailableCities
         * @description Retrieves all available cities from
         * {@link trulii.locations.services.LocationManager LocationManager} Service
         * @requires trulii.locations.services.LocationManager
         * @methodOf trulii.students.config
         */
        getAvailableCities.$inject = ['LocationManager'];
        function getAvailableCities(LocationManager){
            return LocationManager.getAvailableCities();
        }

        /**
         * @ngdoc method
         * @name .#getOrder
         * @description Retrieves an Order by its ID from
         * {@link trulii.students.services.Student Student} Service
         * @methodOf trulii.students.config
         */
        getOrder.$inject = ['$stateParams','student'];
        function getOrder($stateParams, student){
            return student.getOrder($stateParams.orderId);
        }
    }

})();
