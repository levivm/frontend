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
                url:'account/',
                controller: 'StudentAccountCtrl as account',
                templateUrl: 'partials/students/dashboard/account.html'
            })
            .state('student-dashboard.account.password', {
                url:'password',
                templateUrl: 'partials/students/dashboard/account_password.html'
            })
            .state('student-dashboard.account.email', {
                url:'email',
                templateUrl: 'partials/students/dashboard/account_email.html'
            })
            .state('student-dashboard.profile', {
                url:'profile',
                controller: 'StudentProfileCtrl as profile',
                templateUrl: 'partials/students/dashboard/profile.html'
            })
            .state('student-dashboard.activities', {
                url:'activities/',
                controller: 'StudentActivitiesCtrl as activities',
                templateUrl: 'partials/students/dashboard/activities.html',
                resolve:{
                    currentActivities: getStudentCurrentActivities,
                    nextActivities: getStudentNextActivities,
                    pastActivities: getStudentPastActivities,
                    orders: getOrders,
                    reviews: getReviewsForActivities
                  }
            })
            .state('student-dashboard.activities.open', {
                url:'open',
                templateUrl: 'partials/students/dashboard/activities_open.html'
            })
            .state('student-dashboard.activities.closed', {
                url:'closed',
                templateUrl: 'partials/students/dashboard/activities_closed.html'
            })
            .state('student-dashboard.activities.current', {
                url:'current',
                templateUrl: 'partials/students/dashboard/activities_current.html'
            })
            .state('student-dashboard.history', {
                abstract:true,
                url:'history',
                controller: 'StudentHistoryCtrl as history',
                templateUrl: 'partials/students/dashboard/history.html',
                resolve: {
                    orders: getOrders,
                    activityList: getStudentActivityList
                }
            })
            .state('student-dashboard.history.orders', {
                url:'/orders',
                templateUrl: 'partials/students/dashboard/history.orders.html'
            })
            .state('student-dashboard.history.orders.order', {
                url:'/:orderId',
                controller: 'StudentHistoryOrderCtrl as order',
                templateUrl: 'partials/commons/order.html',
                params:{
                    'previousState': {
                        'state': 'student-dashboard.history.orders',
                        'params': {}
                    }
                },
                resolve: {
                    order: getOrder
                }
            })

            .state('student-dashboard.wishlist', {
                url:'wishlist',
                controller: 'StudentWishlistCtrl as wishlist',
                templateUrl: 'partials/students/dashboard/wishlist.html',
                resolve: {
                    wishListActivities: getWishList
                }
            })
            .state('student-dashboard.notifications', {
                url:'notifications/',
                controller: 'StudentMessagesCtrl as messages',
                templateUrl: 'partials/students/dashboard/messages.html',
                resolve: {
                    messages: getMessages
                }
            })
            .state('student-dashboard.messages-detail', {
                url:'notifications/:messageId',
                controller: 'StudentMessageDetailCtrl as detail',
                templateUrl: 'partials/students/dashboard/message_detail.html',
                resolve: {
                  message: getMessage
                }
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
        getStudentNextActivities.$inject = ['$q', 'ActivitiesManager', 'StudentsManager'];
        function getStudentNextActivities($q, ActivitiesManager, StudentsManager){
            return StudentsManager.getCurrentStudent().then(success, error);

            function success(student){
                return ActivitiesManager.getStudentActivities(student.id, 'next');
            }

            function error(){
                $q.reject();
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
        getStudentPastActivities.$inject = ['$q', 'ActivitiesManager', 'StudentsManager'];
        function getStudentPastActivities($q, ActivitiesManager, StudentsManager){
            return StudentsManager.getCurrentStudent().then(success, error);

            function success(student){
                return ActivitiesManager.getStudentActivities(student.id, 'past');
            }

            function error(){
                $q.reject();
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
        getStudentCurrentActivities.$inject = ['$q', 'ActivitiesManager', 'StudentsManager'];
        function getStudentCurrentActivities($q, ActivitiesManager, StudentsManager){
            return StudentsManager.getCurrentStudent().then(success, error);

            function success(student){
                return ActivitiesManager.getStudentActivities(student.id, 'current');
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
         * @name .#getOrders
         * @description Retrieves  all orders that belongs to a student
         * {@link trulii.students.services.Student Student} Service
         * @methodOf trulii.students.config
         */
        getOrder.$inject = ['$stateParams','student'];
        function getOrders($stateParams, student){
            return student.getOrders();
        }


        /**
         * @ngdoc method
         * @name .#getReviewsForActivities
         * @description Retrieves all of a Student's Reviews
         * {@link trulii.students.services.Student Student} Service
         * @methodOf trulii.students.config
         */
        getReviewsForActivities.$inject = ['pastActivities', 'student'];
        function getReviewsForActivities(pastActivities, student){
            return student.getReviews().then(success, error);

            function success(reviews){
                angular.forEach(pastActivities.results, checkReview);
                return reviews;

                function checkReview(activity){
                    if(reviews.filter(hasActivity).length === 0){ reviews.push({}); }

                    function hasActivity(review){ return review.activity === activity.id; }
                }
            }

            function error(response){
                console.log('Error retrieving Student Reviews', response);
                return [];
            }
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

        /**
         * @ngdoc method
         * @name .#getWishList
         * @description Retrieves Wishlist
         * {@link trulii.students.services.Student Student} Service
         * @methodOf trulii.students.config
         */
        getWishList.$inject = ['$stateParams','student'];
        function getWishList($stateParams, student){
            return student.getWishList();
        }
        /**
         * @ngdoc method
         * @name .#getStudentActivityList
         * @description Retrieves Activity List from
         * {@link trulii.payments.services.Payments Payments} Service
         * @requires trulii.payments.services.Payments
         * @methodOf trulii.students.config
         */
        getStudentActivityList.$inject = ['student'];
        function getStudentActivityList(student){
          return student.getActivityList();
        }
        
        /**
         * @ngdoc method
         * @name .#getMessages
         * @description Retrieves a Student's Messages
         * @requires student
         * @methodOf trulii.students.config
         */
        getMessages.$inject = ['student'];
        function getMessages(student){
            return student.getMessages();
        }
        
        /**
         * @ngdoc method
         * @name .#getMessage
         * @description Retrieves a specific message for the Student
         * @requires student
         * @methodOf trulii.students.config
         */
        getMessage.$inject = ['student', '$stateParams'];
        function getMessage(student, $stateParams){
            return student.getMessage($stateParams.messageId);
        }
    }

})();
