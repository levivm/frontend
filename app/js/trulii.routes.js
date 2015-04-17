(function () {
    'use strict';

    angular
        .module('trulii.routes')
        .constant("serverConf", {
            //"url": "http://trulii-back.herokuapp.com",
            "url": "http://localhost:8000"
        })
        .config(config)
        .run(run);

    config.$inject = ['$urlRouterProvider','$stateProvider','$urlMatcherFactoryProvider'];

    /**
     * @name config
     * @desc Define valid application routes
     */
    function config($urlRouterProvider,$stateProvider,$urlMatcherFactoryProvider) {

        $urlMatcherFactoryProvider.strictMode(false);
        $stateProvider
            .state("home",{
                url:"/",
                controller:'HomeController as home',
                resolve:{
                    cities : getAvailableCities,
                    authenticatedUser : getAuthenticatedUser
                },
                templateUrl: 'partials/landing/landing.html'
            })
            .state("register", {
                url:'/register',
                controller: 'RegisterController',
                controllerAs: 'vm',
                templateUrl: 'partials/authentication/register.html'
            })
            .state("login", {
                url:'/login',
                controller: 'LoginController',
                controllerAs: 'vm',
                templateUrl: 'partials/authentication/login.html'
            })
            .state("logout",{
                url:'/logout',
                controller: 'LogOutController'
            })
            .state("password-forgot", {
                url:'/password/forgot',
                controller: 'ForgotPasswordCtrl',
                controllerAs: 'vm',
                templateUrl: 'partials/authentication/forgot_password.html'
            })
            .state("password-reset", {
                url:'/password/reset/key/:reset_key',
                controller: 'ResetPasswordCtrl',
                controllerAs: 'vm',
                templateUrl: 'partials/authentication/reset_password.html'
            })
            .state('email-confirm', {
                url:'/email/confirm/:status/',
                controller: 'EmailConfirmCtrl',
                controllerAs: 'vm',
                //templateUrl: 'partials/email_confirm.html' url(r"
                templateUrl: 'modalContainer'
            })
            .state('modal-dialog', {
                url:'/',
                controller: 'DialogModalCtrl',
                controllerAs: 'vm'
                // onEnter: function($stateParams, $state, $modal) {
                //     var modalInstance = $modal.open({
                //       templateUrl: 'partials/utils/base_dialog_modal.html',
                //       controller: 'ModalInstanceCtrl',
                //     });

                // }
                //templateUrl:'myModalContent.html'
                // views:{
                //   'modal':{
                //     templateUrl:'myModalContent.html'
                //   }

                // }
                //controllerAs: 'vm',
                //templateUrl: 'partials/email_confirm.html' url(r"
                //templateUrl: 'modalContainer'
                //templateUrl: 'partials/utils/base_dialog_modal.html'
            })
            // .state('modal-dialog.login', {
            //   url:'login',
            //   parent: 'modal-dialog',
            //   views:{
            //     'modal@':{
            //       templateUrl: '/partials/authentication/login.html',
            //       controller: 'LoginController',
            //       controllerAs: 'vm',
            //     }

            //   }
            //   //templateUrl: '/partials/authentication/forgot_password.html'
            // })
            .state('modal-dialog.password-forgot', {
                url:'password/forgot/',
                parent: 'modal-dialog',
                views:{
                    'modal@':{
                        templateUrl: '/partials/authentication/forgot_password.html',
                        controller: 'ForgotPasswordCtrl',
                        controllerAs: 'vm'
                    }
                }
                //templateUrl: '/partials/authentication/forgot_password.html'
            })
            // .state('modal-dialog.password-reset', {
            //   url:'password/reset/key/:reset_key/',
            //   parent: 'modal-dialog',
            //   views:{
            //     'modal@':{
            //       templateUrl: '/partials/authentication/reset_password.html',
            //       controller: 'ResetPasswordCtrl',
            //       controllerAs: 'vm',
            //     }

            //   }
            //   //templateUrl: '/partials/authentication/forgot_password.html'
            // })
            // .state('password-reset', {
            //   url:'/password/reset/',
            //   controller: 'ForgotPasswordCtrl',
            //   //controllerAs: 'vm',
            //   //templateUrl: 'partials/email_confirm.html' url(r"
            //   templateUrl: 'modalContainer'
            // })
            // .state('password-reset-key', {
            //   url:'/password/reset/key/:reset_key/',
            //   controller: 'ForgotPasswordCtrl',
            //   //controllerAs: 'vm',
            //   //templateUrl: 'partials/email_confirm.html' url(r"
            //   templateUrl: 'modalContainer'
            // })
            .state('general-message', {
                url:'/messages/:module_name/:template_name/?redirect_state',
                controller: 'SimpleModalMsgCtrl',
                //controllerAs: 'vm',
                //templateUrl: 'partials/email_confirm.html' url(r"
                templateUrl: 'modalContainer'
                //templateUrl: 'partials/authentication/register.html'
            })
            .state('organizer-dashboard', {
                abstract:true,
                url:'/organizer/dashboard/',
                controller: 'OrganizerDashboardCtrl',
                controllerAs: 'vm',
                templateUrl: 'partials/organizers/dashboard.html',
                resolve:{
                    organizer : getOrganizer
                },
                data: {
                    requiredAuthentication : true
                }
                //templateUrl: 'modalContainer'
            })
            .state('organizer-dashboard.profile', {
                url:'profile',
                controller: 'OrganizerProfileCtrl',
                controllerAs: 'vm',
                templateUrl: 'partials/organizers/dashboard_profile.html'
                //templateUrl: 'modalContainer'
            })
            .state('organizer-dashboard.account', {
                url:'account',
                controller: 'OrganizerAccountCtrl',
                controllerAs: 'vm',
                templateUrl: 'partials/organizers/dashboard_account.html'
                //templateUrl: 'modalContainer'
            })
            .state('organizer-dashboard.activities', {
                url:'activities',
                controller: 'OrganizerActivitiesCtrl',
                controllerAs: 'vm',
                templateUrl: 'partials/organizers/dashboard_activities.html',
                //templateUrl: 'modalContainer'
                resolve: {
                    activities: getOrganizerActivities
                }
            })
            .state('organizer-profile', {
                url: '/organizers/{organizer_id:int}/profile',
                controller: 'OrganizerProfileController',
                controllerAs: 'vm',
                templateUrl: 'partials/organizers/profile.html',
                resolve: {
                    organizer: getOrganizerUser,
                    activities: getOrganizerActivities
                }
            })
            .state('activties-new', {
                abstract:true,
                url:'/activities/new/',
                //controller: 'ActivityGeneralController',
                data: {
                    requiredAuthentication : true
                },
                resolve: {
                    activity: getActivity
                },
                //controllerAs: 'vm',
                templateUrl: 'partials/activities/create.html'
                //templateUrl: 'modalContainer'
            })
            .state('activties-new.general', {
                url:'',
                controller: 'ActivityGeneralController',
                controllerAs: 'vm',
                templateUrl: 'partials/activities/dashboard_general.html'
                //templateUrl: 'modalContainer'
            })
            .state('activities-edit', {
                abstract:true,
                url:'/activities/edit/{activity_id:int}/',
                controller: 'ActivityDashboardCtrl',
                data: {
                    requiredAuthentication : true
                },
                resolve: {
                    activity: getActivity
                },
                controllerAs: 'pc',
                templateUrl: 'partials/activities/edit.html'
                //templateUrl: 'modalContainer'
            })
            .state('activities-edit.general', {
                url:'',
                controller: 'ActivityGeneralController',
                controllerAs: 'vm',
                templateUrl: 'partials/activities/dashboard_general.html'
                //templateUrl: 'modalContainer'
            })
            .state('activities-edit.detail', {
                url:'detail',
                controller: 'ActivityDBDetailController',
                // resolve:{
                //   activity : getParentActivity
                // },
                controllerAs: 'vm',
                templateUrl: 'partials/activities/dashboard_detail.html'
                //templateUrl: 'modalContainer'
            })
            .state('activities-edit.calendars', {
                url:'calendars',
                controller: 'ActivityCalendarsController',
                controllerAs: 'vm',
                templateUrl: 'partials/activities/dashboard_calendars.html',
                resolve:{
                    active: function () {
                        return false;
                    },
                    calendars:getCalendars
                }
                //templateUrl: 'modalContainer'
            })
            .state('activities-edit.calendars.detail' ,{
                url:'?id',
                controller: 'ActivityCalendarController',
                controllerAs: 'vm',
                templateUrl: 'partials/activities/dashboard_calendar_detail.html',
                resolve: {
                    calendar: getCalendar
                }
            })
            .state('activities-edit.location', {
                url:'location',
                controller: 'ActivityDBLocationController',
                resolve:{
                    cities:getAvailableCities
                },
                controllerAs: 'vm',
                templateUrl: 'partials/activities/dashboard_location.html'
            })
            .state('activities-edit.gallery', {
                url:'gallery',
                controller: 'ActivityDBGalleryController',
                controllerAs: 'vm',
                templateUrl: 'partials/activities/dashboard_gallery.html'
            })
            .state('activities-edit.return-policy', {
                url:'return-policy',
                controller: 'ActivityDBReturnPDashboard',
                controllerAs: 'vm',
                templateUrl: 'partials/activities/dashboard_return_policy.html'
            })
            .state('activities-detail', {
                url:'/activities/{activity_id:int}',
                controller: 'ActivityDetailController',
                controllerAs: 'pc',
                resolve: {
                    activity: getActivity,
                    cities: getAvailableCities,
                    active: function () {
                        return true;
                    },
                    calendars: getCalendars
                },
                templateUrl: 'partials/activities/detail.html'
            })
            .state('activities-detail.info', {
                url: '',
                controller: 'ActivityDetailInfoController',
                controllerAs: 'vm',
                templateUrl: 'partials/activities/detail.info.html'
            })
            .state('activities-detail.calendar', {
                url: '',
                controller: 'ActivityDetailCalendarController',
                controllerAs: 'vm',
                templateUrl: 'partials/activities/detail.calendar.html'
            })
            .state('activities-detail.attendees', {
                url: '',
                controller: 'ActivityDetailAttendeesController',
                controllerAs: 'vm',
                templateUrl: 'partials/activities/detail.attendees.html'
            })
            .state('activities-enroll', {
                url: '/activities/{activity_id:int}/enroll/{calendar_id:int}',
                controller: 'ActivityDetailEnrollController',
                controllerAs: 'pc',
                templateUrl: 'partials/activities/detail.enroll.html',
                resolve: {
                    activity: getActivity,
                    calendar: fetchCalendar
                }
            })
            .state('activities-enroll.success', {
                url: '',
                controller: 'ActivityEnrollSuccessController',
                controllerAs: 'vm',
                templateUrl: 'partials/activities/detail.enroll.success.html',
                resolve: {
                    //activity: getActivity,
                    //calendar: fetchCalendar,
                    organizer: ['activity', function (activity) {
                        return  activity.organizer
                    }],
                    organizerActivities: getOrganizerActivities
                }
            });

        $urlRouterProvider.otherwise('/');

    }

    /****** RESOLVER FUNCTIONS USERS *******/

    getAuthenticatedUser.$inject = ['Authentication'];

    function getAuthenticatedUser(Authentication){
        return Authentication.getAuthenticatedAccount()
    }

    getOrganizer.$inject = ['Authentication','Organizer'];

    function getOrganizer(Authentication,Organizer){

        var authenticatedUser =  Authentication.getAuthenticatedAccount();
        var is_organizer = true;

        console.log("Authentication",authenticatedUser);

        if(authenticatedUser){
            is_organizer = authenticatedUser.user_type == 'O';
        }

        return is_organizer ? new Organizer(authenticatedUser) : $q.reject()
    }

    getOrganizerActivities.$inject = ['ActivitiesManager','organizer'];

    function getOrganizerActivities(ActivitiesManager,organizer){
        return ActivitiesManager.loadOrganizerActivities(organizer.id)
    }

    getOrganizerUser.$inject = ['$stateParams', 'organizersManager'];

    function getOrganizerUser($stateParams, organizersManager) {
        return organizersManager.getOrganizer($stateParams.organizer_id)
    }

    /****** RESOLVER FUNCTIONS ACTIVITIES *******/

    getAvailableCities.$inject = ['$stateParams','$q','LocationManager'];

    function getAvailableCities($stateParams,$q,LocationManager){
        return LocationManager.getAvailableCities()
    }

    getCalendars.$inject = ['CalendarsManager','activity', 'active'];

    function getCalendars(CalendarsManager, activity, active){
        return CalendarsManager.loadCalendars(activity.id, active);
    }

    getCalendar.$inject = ['$stateParams','CalendarsManager','activity'];

    function getCalendar($stateParams, CalendarsManager, activity){

        var calendar_id = $stateParams.id;
        return CalendarsManager.getCalendar(calendar_id);
    }


    fetchCalendar.$inject = ['$stateParams', 'CalendarsManager'];

    function fetchCalendar($stateParams, CalendarsManager) {
        var activityId = $stateParams.activity_id;
        var calendarId = $stateParams.calendar_id;

        return CalendarsManager.fetchCalendar(activityId, calendarId);
    }

    getActivity.$inject = ['$stateParams','$q','ActivitiesManager'];

    function getActivity($stateParams,$q,ActivitiesManager){
        return ActivitiesManager.getActivity($stateParams.activity_id)
    }

    /****** RUN METHOD*******/
    run.$inject = ['$rootScope','$state','$urlMatcherFactory','Authentication'];

    function run($rootScope,$state,$urlMatcherFactory,Authentication){

        $urlMatcherFactory.strictMode(false);
        $rootScope.$on('$stateChangeStart',function(e,toState,toParams,fromState){

            $state.previous = fromState;

            if (toState.data && toState.data.requiredAuthentication) {
                var _requiredAuthentication = toState.data.requiredAuthentication;

                if (_requiredAuthentication && !Authentication.isAuthenticated()) {
                    e.preventDefault();
                    $state.go('home', { 'notify': false });
                }
            } else {
                return;
            }
        });
    }
})();

