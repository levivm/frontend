(function () {
    'use strict';

    angular
        .module('trulii.categories', [
            'trulii.categories.controllers',
            'trulii.categories.services'

        ])
        .constant('CategoriesTemplatesPath', "partials/activities/")
        .constant('angularMomentConfig', {
            timezone: 'America/Bogota'
        })
        .config(config);

    angular
        .module('trulii.categories.controllers', ['ngTagsInput']);

    angular
        .module('trulii.categories.services', ['ngCookies']);

    //noinspection JSValidateJSDoc
    /**
     * @ngdoc object
     * @name trulii.categories.config
     * @description Categories Module Config function
     * @requires ui.router.state.$stateProvider
     */
    config.$inject = ['$stateProvider'];
    function config($stateProvider) {


        $stateProvider
            .state('category', {
                url:'/{category_name}',
                params: {
                  activity_title: {value: null, squash: true}
                },
                views:{
                    '@': {
                        controller: 'ActivityDetailController as detail',
                        templateUrl: 'partials/activities/detail/detail.html'
                    },
                    'attendees@activities-detail': {
                        controller: 'ActivityDetailAttendeesController as attendees',
                        templateUrl: 'partials/activities/detail/attendees.html'
                    }
                },
                resolve: {
                    active: function () {
                        return true;
                    },
                    currentUser: getAuthenticatedUser,
                    activity: getActivity,
                    reviews: getReviews,
                    calendars: getCalendars,
                    organizer: getActivityOrganizer,
                    relatedActivities: getOrganizerActivities
                }
            });

        /**
         * @ngdoc method
         * @name .#getAuthenticatedUser
         * @description Retrieves the current authenticated user from
         * {@link trulii.authentication.services.Authentication Authentication} Service
         * @requires trulii.authentication.services.Authentication
         * @methodOf trulii.activities.config
         */
        getAuthenticatedUser.$inject = ['Authentication'];
        function getAuthenticatedUser(Authentication){
            return Authentication.getAuthenticatedAccount();
        }

        /**
         * @ngdoc method
         * @name .#getCurrentOrganizer
         * @description Retrieves the current logged Organizer from
         * {@link trulii.organizers.services.OrganizersManager OrganizersManager} Service otherwise returns ``null``
         * @requires ng.$timeout
         * @requires ui.router.state.$state
         * @requires ng.$q
         * @requires trulii.organizers.services.OrganizersManager
         * @methodOf trulii.activities.config
         */
        getCurrentOrganizer.$inject = ['$q', 'OrganizersManager'];
        function getCurrentOrganizer($q, OrganizersManager){

            return OrganizersManager.getCurrentOrganizer().then(success, error);

            function success(organizer){
                if(organizer){
                    return organizer;
                } else {
                    return $q.reject();
                }
            }

            function error(response){
                if(response === null){
                    console.log("getCurrentOrganizer. There is no Authenticated User");
                } else {
                    console.log("getCurrentOrganizer. The Authenticated User is not a Organizer");
                }
                return $q.reject();
            }
        }

        /**
         * @ngdoc method
         * @name .#isActivityOwner
         * @description Retrieves the current logged Organizer from
         * {@link trulii.organizers.services.OrganizersManager OrganizersManager} Service otherwise returns ``null``
         * @requires ng.$timeout
         * @requires ui.router.state.$state
         * @requires ng.$q
         * @requires trulii.organizers.services.OrganizersManager
         * @methodOf trulii.activities.config
         */
        isActivityOwner.$inject = ['$q', 'activity', 'organizer'];
        function isActivityOwner($q, activity, organizer){
            var deferred = $q.defer();

            if(organizer.id === activity.organizer.id){
                deferred.resolve(true);
            } else {
                deferred.reject("Organizer '" + organizer.name + "' doesn't own activity '" + activity.title + "'");
            }

            return deferred.promise;
        }

        /**
         * @ngdoc method
         * @name .#getActivityOrganizer
         * @description Retrieves the Organizer Object from the resolved Activity
         * @requires activity
         * @methodOf trulii.activities.config
         */
        getActivityOrganizer.$inject = ['$q', 'activity', 'LocationManager', 'defaultPicture'];
        function getActivityOrganizer($q, activity, LocationManager, defaultPicture){
            var deferred = $q.defer();

            var organizer = activity.organizer;
            if(!organizer.photo){
               organizer.photo = defaultPicture;
            }

            if(!!organizer.locations[0]){
                var city_id = organizer.locations[0].city;
                organizer.city = LocationManager.getCityById(city_id).name;
            }

            deferred.resolve(organizer);

            return deferred.promise;
        }

        /**
         * @ngdoc method
         * @name .#getOrganizerActivities
         * @description Retrieves an Organizer's Activities from
         * {@link trulii.activities.services.ActivitiesManager ActivitiesManager} Service with its ID
         * @requires trulii.activities.services.ActivitiesManager
         * @requires organizer
         * @methodOf trulii.activities.config
         */
        getOrganizerActivities.$inject = ['ActivitiesManager','organizer'];
        function getOrganizerActivities(ActivitiesManager, organizer){
            return ActivitiesManager.loadOrganizerActivities(organizer.id);
        }

        /**
         * @ngdoc method
         * @name .#getActivity
         * @description Retrieves an Activity by its ID from
         * {@link trulii.activities.services.ActivitiesManager ActivitiesManager} Service
         * @requires trulii.activities.services.ActivitiesManager
         * @methodOf trulii.activities.config
         */
        getActivity.$inject = ['$stateParams','ActivitiesManager'];
        function getActivity($stateParams,ActivitiesManager){
            return ActivitiesManager.getActivity($stateParams.activity_id);
        }

        /**
         * @ngdoc method
         * @name .#getPresaveActivityInfo
         * @description Loads general activity info like categories, subcategories, levels, etc. from
         * {@link trulii.activities.services.ActivitiesManager ActivitiesManager} Service
         * @requires trulii.activities.services.ActivitiesManager
         * @methodOf trulii.activities.config
         */
        getPresaveActivityInfo.$inject = ['ActivitiesManager'];
        function getPresaveActivityInfo(ActivitiesManager){
            return ActivitiesManager.loadGeneralInfo();
        }

        /**
         * @ngdoc method
         * @name .#getCalendars
         * @description Gets all calendars for a given activity (using its ID) from
         * {@link trulii.activities.services.CalendarsManager CalendarsManager} Service
         * @requires trulii.activities.services.CalendarsManager
         * @requires activity
         * @methodOf trulii.activities.config
         */
        getCalendars.$inject = ['CalendarsManager','activity'];
        function getCalendars(CalendarsManager, activity){
            return CalendarsManager.loadCalendars(activity.id);
        }

        /**
         * @ngdoc method
         * @name .#getReviews
         * @description Gets Reviews for Activity
         * @requires activity
         * @methodOf trulii.activities.config
         */
        getReviews.$inject = ['Organizer', 'activity'];
        function getReviews(Organizer, activity){
            var organizer = new Organizer(angular.copy(activity.organizer));
            return organizer.getReviews().then(success, error);

            function success(reviews){
                return reviews;
                //return reviews.filter(filterByActivity);

                function filterByActivity(review){
                    return review.activity === activity.id;
                }
            }
            function error(response){
                return [];
            }
        }

        /**
         * @ngdoc method
         * @name .#getCalendar
         * @description Gets a Calendar by its ID from
         * {@link trulii.activities.services.CalendarsManager CalendarsManager} Service
         * @requires ui.router.state.$stateParams
         * @requires calendars
         * @requires trulii.activities.services.CalendarsManager
         * @methodOf trulii.activities.config
         */
        getCalendar.$inject = ['$stateParams','CalendarsManager', 'calendars', 'activity'];
        function getCalendar($stateParams, CalendarsManager, calendars, activity){
            return CalendarsManager.getCalendar($stateParams.calendar_id, activity.id);
        }

        /**
         * @ngdoc method
         * @name .#fetchCalendar
         * @description Fetches a Calendar by Activity ID and Calendar ID in $stateParams from
         * {@link trulii.activities.services.CalendarsManager CalendarsManager} Service
         * @requires ui.router.state.$stateParams
         * @requires trulii.activities.services.CalendarsManager
         * @methodOf trulii.activities.config
         */
        fetchCalendar.$inject = ['$stateParams', 'CalendarsManager'];
        function fetchCalendar($stateParams, CalendarsManager) {
            var activityId = $stateParams.activity_id;
            var calendarId = $stateParams.calendar_id;

            return CalendarsManager.fetchCalendar(activityId, calendarId);
        }

        /**
         * @ngdoc method
         * @name .#fetchCalendarArray
         * @description get fetched calendar and returns it inside an Array
         * @requires ui.router.state.$stateParams
         * @requires calendar
         * @methodOf trulii.activities.config
         */
        fetchCalendarArray.$inject = ['calendar'];
        function fetchCalendarArray(calendar) {
            var array = [];
            if (calendar){ array.push(calendar); }
            return array;
        }

        /**
         * @ngdoc method
         * @name .#getOrder
         * @description Retrieves an Order by its ID from
         * {@link trulii.students.services.Student Student} Service
         * @methodOf trulii.students.config
         */
        getOrder.$inject = ['$stateParams','activity'];
        function getOrder($stateParams, activity){
            return activity.getOrder($stateParams.orderId);
        }

        /**
         * @ngdoc method
         * @name .#getOrders
         * @description Retrieves the orders for an activity
         * {@link trulii.students.services.Student Student} Service
         * @methodOf trulii.students.config
         */
        getOrders.$inject = ['$stateParams','ActivitiesManager'];
        function getOrders($stateParams, ActivitiesManager){
            return ActivitiesManager.getOrders($stateParams.activity_id, $stateParams.calendar_id);
        }


        /**
         * @ngdoc method
         * @name .#getAvailableCities
         * @description Retrieves all available cities from
         * {@link trulii.locations.services.LocationManager LocationManager} Service
         * @requires trulii.locations.services.LocationManager
         * @methodOf trulii.activities.config
         */
        getAvailableCities.$inject = ['LocationManager'];
        function getAvailableCities(LocationManager){
            return LocationManager.getAvailableCities();
        }

        /**
         * @ngdoc method
         * @name .#getDeviceSessionId
         * @description Generates deviceSessionId used in Pay U endpoint
         * @methodOf trulii.activities.config
         */
        getDeviceSessionId.$inject = ['localStorageService','md5'];
        function getDeviceSessionId(localStorageService,md5){
            var token = localStorageService.get('token');
            var time_stamp = new Date().getTime();
            var string = token + time_stamp.toString();
            var deviceSessionId = md5.createHash(string);
            return deviceSessionId;
        }

        /**
         * @ngdoc method
         * @name .#getMessages
         * @description Retrieves an Activity's Messages
         * @requires organizer
         * @methodOf trulii.activities.config
         */
        getMessages.$inject = ['activity'];
        function getMessages(activity){
            return activity.getMessages();
        }

        /**
         * @ngdoc method
         * @name .#getStats
         * @description Retrieves an Activity's Stats
         * @requires organizer
         * @methodOf trulii.activities.config
         */
        getStats.$inject = ['activity', 'moment'];
        function getStats(activity, moment){
            return activity.getStats(moment().year(), moment().month()+1);
        }

        /**
         * @ngdoc method
         * @name .#getMessage
         * @description Retrieves a specific message from the activity
         * @requires organizer
         * @methodOf trulii.activities.config
         */
        getMessage.$inject = ['activity', '$stateParams'];
        function getMessage(activity, $stateParams){
            return activity.getMessage($stateParams.messageId);
        }

        /**
         * @ngdoc method
         * @name .#isStudent
         * @description Checks if user is student. If `false` redirects to detail
         * @methodOf trulii.activities.config
         */
        isStudent.$inject = ['$state', 'currentUser', 'activity'];
        function isStudent($state, currentUser, activity){
            if(currentUser && currentUser.user_type === 'S'){
                return true;
            } else {
                $state.go('activities-detail', { activity_id: activity.id });
            }
        }

        /**
         * @ngdoc method
         * @name .#isActive
         * @description Checks if an activity is `active`
         * @methodOf trulii.activities.config
         */
        isActive.$inject = ['$state', 'activity'];
        function isActive($state, activity){
            if(activity.published){
                return true;
            } else {
                $state.go('activities-detail', { activity_id: activity.id });
            }
        }

        // api/activities/<id>/views_counter

    }

})();
