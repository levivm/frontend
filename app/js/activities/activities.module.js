(function () {
    'use strict';

    angular
        .module('trulii.activities', [
            'uiGmapgoogle-maps',
            'youtube-embed',
            'trulii.activities.config',
            'trulii.activities.controllers',
            'trulii.activities.services',
            'trulii.activities.directives'
        ])
        .constant('ActivitiesTemplatesPath', "partials/activities/")
        .config(config);

    angular
        .module('trulii.activities.config', []);

    angular
        .module('trulii.activities.controllers', ['ngTagsInput']);

    angular
        .module('trulii.activities.services', ['ngCookies']);

    angular
        .module('trulii.activities.directives', []);

    //noinspection JSValidateJSDoc
    /**
     * @ngdoc object
     * @name trulii.activities.config
     * @description Activities Module Config function
     * @requires ui.router.state.$stateProvider
     */
    config.$inject = ['$stateProvider'];
    function config($stateProvider) {
        $stateProvider
            .state('dash', {
                    templateUrl: 'partials/dashboard.html'
                })
            .state('dash.activities-new', {
                abstract: true,
                url: '/activities/new',
                data: {
                    requiredAuthentication : true
                },
                resolve: {
                    presaveInfo: getPresaveActivityInfo,
                    activity: getActivity,
                    organizer : getCurrentOrganizer
                },
                templateUrl: 'partials/activities/create.html'
            })
            .state('dash.activities-new.general', {
                url:'',
                controller: 'ActivityGeneralController',
                controllerAs: 'vm',
                templateUrl: 'partials/activities/dashboard_general.html'
            })
            .state('dash.activities-edit', {
                abstract:true,
                url:'/activities/edit/{activity_id:int}/',
                controller: 'ActivityDashboardCtrl',
                data: {
                    requiredAuthentication : true
                },
                resolve: {
                    presaveInfo: getPresaveActivityInfo,
                    activity: getActivity,
                    organizer : getCurrentOrganizer
                },
                controllerAs: 'pc',
                templateUrl: 'partials/activities/edit.html'
            })
            .state('dash.activities-edit.general', {
                url:'',
                controller: 'ActivityGeneralController',
                controllerAs: 'vm',
                templateUrl: 'partials/activities/dashboard_general.html'
            })
            .state('dash.activities-edit.detail', {
                url:'detail',
                controller: 'ActivityDBDetailController',
                controllerAs: 'vm',
                templateUrl: 'partials/activities/dashboard_detail.html'
            })
            .state('dash.activities-edit.calendars', {
                url:'calendars',
                controller: 'ActivityCalendarsController',
                controllerAs: 'vm',
                templateUrl: 'partials/activities/dashboard_calendars.html',
                resolve:{
                    calendars:getCalendars
                },
                params: {
                    'republish': false
                }
            })
            .state('dash.activities-edit.calendars.detail', {
                url:'/:calendar_id',
                controller: 'ActivityCalendarController',
                controllerAs: 'vm',
                templateUrl: 'partials/activities/dashboard_calendar_detail.html',
                resolve: {
                    calendar: getCalendar
                }
            })
            .state('dash.activities-edit.location', {
                url:'location',
                controller: 'ActivityDBLocationController',
                resolve:{
                    cities: getAvailableCities,
                    organizer : getCurrentOrganizer
                },
                controllerAs: 'vm',
                templateUrl: 'partials/activities/dashboard_location.html'
            })
            .state('dash.activities-edit.instructors', {
                url:'instructors',
                controller: 'ActivityDBInstructorsController',
                controllerAs: 'vm',
                templateUrl: 'partials/activities/dashboard_instructors.html'
            })
            .state('dash.activities-edit.gallery', {
                url:'gallery',
                controller: 'ActivityDBGalleryController as gallery',
                templateUrl: 'partials/activities/dashboard_gallery.html'
            })
            .state('dash.activities-edit.return-policy', {
                url:'return-policy',
                controller: 'ActivityDBReturnPDashboard',
                controllerAs: 'vm',
                templateUrl: 'partials/activities/dashboard_return_policy.html'
            })
            .state('dash.activities-manage', {
                url:'/activities/manage/{activity_id:int}/',
                abstract: true,
                controller: 'ActivitiesManageCtrl as manage',
                resolve: {
                    activity: getActivity
                },
                templateUrl: 'partials/activities/manage.html'
            })
            .state('dash.activities-manage.orders', {
                url:'orders',
                templateUrl: 'partials/activities/manage_orders.html'
            })
            .state('dash.activities-manage.assistants', {
                url:'assistants',
                templateUrl: 'partials/activities/manage_assistants.html'
            })
            .state('activities-detail', {
                url:'/activities/{activity_id:int}/',
                abstract: true,
                controller: 'ActivityDetailController as detail',
                templateUrl: 'partials/activities/detail.html',
                resolve: {
                    activity: getActivity,
                    cities: getAvailableCities,
                    active: function () {
                        return true;
                    },
                    calendars: getCalendars
                }
            })
            .state('activities-detail.info', {
                url: 'info',
                templateUrl: 'partials/activities/detail.info.html'
            })
            .state('activities-detail.calendar', {
                url: 'calendar',
                templateUrl: 'partials/activities/detail.calendar.html'
            })
            .state('activities-detail.attendees', {
                url: 'attendees',
                controller: 'ActivityDetailAttendeesController as attendees',
                templateUrl: 'partials/activities/detail.attendees.html'
            })
            .state('activities-enroll', {
                url: '/activities/{activity_id:int}/enroll/{calendar_id:int}',
                controller: 'ActivityDetailEnrollController as enroll',
                templateUrl: 'partials/activities/detail.enroll.html',
                resolve: {
                    activity: getActivity,
                    calendar: fetchCalendar,
                    currentUser: getAuthenticatedUser
                }
            })
            .state('activities-enroll.success', {
                url: '/success',
                controller: 'ActivityEnrollSuccessController as success',
                templateUrl: 'partials/activities/detail.enroll.success.html',
                resolve: {
                    organizer: ['activity', function (activity) {
                        return  activity.organizer;
                    }],
                    organizerActivities: getOrganizerActivities
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
        getCurrentOrganizer.$inject = ['$timeout', '$state', '$q', 'OrganizersManager'];
        function getCurrentOrganizer($timeout, $state, $q, OrganizersManager){

            return OrganizersManager.getCurrentOrganizer().then(success, error);

            function success(organizer){
                if(organizer){
                    return organizer;
                } else {
                    //$timeout(function() { $state.go('home'); });
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
         * @name .#getCalendar
         * @description Gets a Calendar by its ID from
         * {@link trulii.activities.services.CalendarsManager CalendarsManager} Service
         * @requires ui.router.state.$stateParams
         * @requires trulii.activities.services.CalendarsManager
         * @methodOf trulii.activities.config
         */
        getCalendar.$inject = ['$stateParams','CalendarsManager'];
        function getCalendar($stateParams, CalendarsManager){
            return CalendarsManager.getCalendar($stateParams.calendar_id);
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
    }

})();
