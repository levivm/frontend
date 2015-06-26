(function () {
    'use strict';

    /**
     * @ngdoc service
     * @name trulii.routes.serverConf
     * @description Server URL for API usage
     * @property {string} url Backend Server URL
     */
    angular
        .module('trulii.routes')
        .constant("serverConf", {
            //"url": "http://trulii-back.herokuapp.com"
            "url": "http://localhost:8000"
        });

    angular
        .module('trulii.routes')
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

            .state('brow', {                
                templateUrl: 'partials/browsing.html'
            })

            .state('dash', {                
                templateUrl: 'partials/browsing.html'
            })

            .state('home',{
                url:'/',
                controller:'HomeController as home',
                resolve:{
                    cities:getAvailableCities,
                    authenticatedUser: getAuthenticatedUser
                },
                templateUrl: 'partials/landing/landing.html'                        
            })
            
            .state('register', {
                url:'/register',
                controller: 'RegisterController',
                controllerAs: 'vm',
                templateUrl: 'partials/authentication/register.html',
                params: {
                    'from': {
                        'state': undefined,
                        'params': {}
                    }
                },
                resolve:{
                    validatedData: tokenSignupValidation
                }
            })
            .state('register-organizer', {
                url:'/organizers/register/:token/',
                controller: 'RegisterController',
                controllerAs: 'vm',
                resolve: {
                    validatedData :  tokenSignupValidation
                },
                templateUrl: 'partials/authentication/register_organizer.html'
            })
            .state('login', {
                url:'/login',
                controller: 'LoginController',
                controllerAs: 'vm',
                templateUrl: 'partials/authentication/login.html',
                params: {
                    'from' : {
                        'state' : undefined,
                        'params' : {}

                    }
                }
            })
            .state('logout',{
                url:'/logout',
                controller: 'LogOutController'
            })
            .state('password-forgot', {
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
                url:'/email/confirm/:key/',
                controller: 'EmailConfirmCtrl',
                controllerAs: 'vm',
                //templateUrl: 'partials/email_confirm.html' url(r"
                templateUrl: 'modalContainer'
            })
            // .state('email-confirm', {
            //     url:'/email/confirm/:status/',
            //     controller: 'EmailConfirmCtrl',
            //     controllerAs: 'vm',
            //     //templateUrl: 'partials/email_confirm.html' url(r"
            //     templateUrl: 'modalContainer'
            // })

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
                controllerAs: 'vm',
                //templateUrl: 'partials/email_confirm.html' url(r"
                templateUrl: 'modalContainer'
                //templateUrl: 'partials/authentication/register.html'
            })
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
            .state('organizer-landing', {
                url:'/organizers/landing/',
                controller: 'OrganizerLandingCtrl',
                controllerAs: 'vm',
                templateUrl: 'partials/organizers/landing.html',
                resolve:{
                    cities: getAvailableCities
                }

            })
            .state('organizer-dashboard', {
                abstract:true,
                url:'/organizer/dashboard/',
                controller: 'OrganizerDashboardCtrl as dash',
                templateUrl: 'partials/organizers/dashboard.html',
                resolve:{
                    cities:getAvailableCities,
                    organizer : getCurrentOrganizer
                },
                data: {
                    requiredAuthentication : true
                }
                //templateUrl: 'modalContainer'
            })
            .state('organizer-dashboard.profile', {
                url:'profile',
                controller: 'OrganizerProfileCtrl as profile',
                templateUrl: 'partials/organizers/dashboard_profile.html'
                //templateUrl: 'modalContainer'
            })
            .state('organizer-dashboard.account', {
                url:'account',
                controller: 'OrganizerAccountCtrl as account',
                templateUrl: 'partials/organizers/dashboard_account.html'
                //templateUrl: 'modalContainer'
            })
            .state('organizer-dashboard.activities', {
                url:'activities',
                controller: 'OrganizerActivitiesCtrl as activities',
                templateUrl: 'partials/organizers/dashboard_activities.html',
                //templateUrl: 'modalContainer'
                resolve: {
                    activities: getOrganizerActivities
                }
            })

            .state('organizer-profile', {
                url: '/organizers/{organizer_id:int}/profile',
                controller: 'OrganizerProfileController as profile',
                templateUrl: 'partials/organizers/profile.html',
                resolve: {
                    organizer: getOrganizer,
                    activities: getOrganizerActivities
                }
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
                //templateUrl: 'modalContainer'
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
                //templateUrl: 'modalContainer'
            })
            .state('dash.activities-edit.general', {
                url:'',
                controller: 'ActivityGeneralController',
                controllerAs: 'vm',
                resolve: {
                    presaveInfo: getPresaveActivityInfo,
                    activity: getActivity
                },
                templateUrl: 'partials/activities/dashboard_general.html'
                //templateUrl: 'modalContainer'
            })
            .state('dash.activities-edit.detail', {
                url:'detail',
                controller: 'ActivityDBDetailController',
                // resolve:{
                //   activity : getParentActivity
                // },
                controllerAs: 'vm',
                templateUrl: 'partials/activities/dashboard_detail.html'
                //templateUrl: 'modalContainer'
            })
            .state('dash.activities-edit.calendars', {
                url:'calendars',
                controller: 'ActivityCalendarsController',
                controllerAs: 'vm',
                templateUrl: 'partials/activities/dashboard_calendars.html',
                resolve:{
                    calendars:getCalendars
                }
                //templateUrl: 'modalContainer'
            })
            .state('dash.activities-edit.calendars.detail', {
                url:'?id',
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
                controller: 'ActivityDBGalleryController',
                controllerAs: 'vm',
                templateUrl: 'partials/activities/dashboard_gallery.html'
            })
            .state('dash.activities-edit.return-policy', {
                url:'return-policy',
                controller: 'ActivityDBReturnPDashboard',
                controllerAs: 'vm',
                templateUrl: 'partials/activities/dashboard_return_policy.html'
            })
            .state('activities-detail', {
                url:'/activities/{activity_id:int}/',
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
                controller: 'ActivityDetailEnrollController',
                controllerAs: 'pc',
                templateUrl: 'partials/activities/detail.enroll.html',
                resolve: {
                    activity: getActivity,
                    calendar: fetchCalendar,
                    currentUser: getAuthenticatedUser
                }
            })
            .state('activities-enroll.success', {
                url: '',
                controller: 'ActivityEnrollSuccessController',
                controllerAs: 'vm',
                templateUrl: 'partials/activities/detail.enroll.success.html',
                resolve: {
                    organizer: ['activity', function (activity) {
                        return  activity.organizer;
                    }],
                    organizerActivities: getOrganizerActivities
                }
            });

        $urlRouterProvider.otherwise('/');
    }

    /****** RESOLVER FUNCTIONS USERS *******/

    tokenSignupValidation.$inject = ['$stateParams','Authentication'];

    function tokenSignupValidation($stateParams,Authentication){
        var token = $stateParams.token;
        if (!(token))
            return {};
        return Authentication.requestSignupToken($stateParams.token);
    }

    getAuthenticatedUser.$inject = ['Authentication'];

    function getAuthenticatedUser(Authentication){
        return Authentication.getAuthenticatedAccount();
    }

    getCurrentOrganizer.$inject = ['$timeout','$state','Authentication', 'OrganizersManager'];

    function getCurrentOrganizer($timeout,$state,Authentication, OrganizersManager){

        var authenticatedUser =  Authentication.getAuthenticatedAccount();
        var force_fetch = true;
        return Authentication.getAuthenticatedAccount().then(successAuthAccount, errorAuthAccount);

        function successAuthAccount(authenticatedUser){
            return Authentication.isOrganizer().then(function(isOrganizer){
                if(authenticatedUser && isOrganizer){
                    return OrganizersManager.getOrganizer(authenticatedUser.id, force_fetch);
                } else {
                    $timeout(function() {
                        $state.go('home');
                    });
                    return $q.reject()
                }
            });
        }
        function errorAuthAccount(){
            console.log("getCurrentOrganizer. Couldn't resolve authenticatedUser");
        }
    }

    getOrganizer.$inject = ['$stateParams', 'OrganizersManager'];

    function getOrganizer($stateParams, OrganizersManager) {
        return OrganizersManager.getOrganizer($stateParams.organizer_id);
    }

    getCurrentStudent.$inject = ['$timeout', '$state', 'Authentication', 'StudentsManager'];

    function getCurrentStudent($timeout, $state, Authentication, StudentsManager){

        var force_fetch = true;

        return Authentication.getAuthenticatedAccount().then(successAuthAccount, errorAuthAccount);

        function successAuthAccount(authenticatedUser){
            return Authentication.isStudent().then(function(isStudent){
                if(authenticatedUser && isStudent){
                    return StudentsManager.getStudent(authenticatedUser.id, force_fetch);
                } else {
                    $timeout(function() {
                        $state.go('home');
                    });
                    return $q.reject()
                }
            });
        }
        function errorAuthAccount(){
            console.log("getCurrentStudent. Couldn't resolve authenticatedUser");
        }

    }

    getStudent.$inject = ['$stateParams', 'StudentsManager'];

    function getStudent($stateParams, StudentsManager) {
        console.log('$stateParams.student_id:', $stateParams.student_id);
        return StudentsManager.getStudent($stateParams.student_id);
    }


    getOrganizerActivities.$inject = ['ActivitiesManager','organizer'];

    function getOrganizerActivities(ActivitiesManager, organizer){
        return ActivitiesManager.loadOrganizerActivities(organizer.id);
    }

    /****** RESOLVER FUNCTIONS ACTIVITIES *******/

    getAvailableCities.$inject = ['LocationManager'];

    function getAvailableCities(LocationManager){
        return LocationManager.getAvailableCities();
    }

    getActivities.$inject = ['ActivitiesManager'];

    function getActivities(ActivitiesManager){
        return ActivitiesManager.getActivities();
    }

    getStudentActivities.$inject = ['ActivitiesManager', 'Authentication', 'StudentsManager'];

    function getStudentActivities(ActivitiesManager, Authentication, StudentsManager){
        var currentUser =  Authentication.getAuthenticatedAccount();
        if(Authentication.isStudent()){
            return ActivitiesManager.getStudentActivities(currentUser.id);
        }
    }

    getCalendars.$inject = ['CalendarsManager','activity'];

    function getCalendars(CalendarsManager, activity){
        return CalendarsManager.loadCalendars(activity.id);
    }

    getCalendar.$inject = ['$stateParams','CalendarsManager'];

    function getCalendar($stateParams, CalendarsManager){
        var calendar_id = $stateParams.id;
        return CalendarsManager.getCalendar(calendar_id);
    }

    fetchCalendar.$inject = ['$stateParams', 'CalendarsManager'];

    function fetchCalendar($stateParams, CalendarsManager) {
        var activityId = $stateParams.activity_id;
        var calendarId = $stateParams.calendar_id;

        return CalendarsManager.fetchCalendar(activityId, calendarId);
    }

    getActivity.$inject = ['$stateParams','ActivitiesManager'];

    function getActivity($stateParams,ActivitiesManager){
        return ActivitiesManager.getActivity($stateParams.activity_id);
    }

    getPresaveActivityInfo.$inject = ['ActivitiesManager'];

    function getPresaveActivityInfo(ActivitiesManager){
        return ActivitiesManager.loadGeneralInfo();
    }

    /****** RUN METHOD*******/

    run.$inject = ['$rootScope','$state','$urlMatcherFactory','Authentication'];

    function run($rootScope,$state,$urlMatcherFactory,Authentication){

        $urlMatcherFactory.strictMode(false);

        $rootScope.$on('$stateChangeStart', onStateChange);               

        ///////////

        function onStateChange(e, toState, toParams, fromState){
            $state.previous = fromState;
           
            if (toState.data && toState.data.requiredAuthentication) {
                var _requiredAuthentication = toState.data.requiredAuthentication;

                if (_requiredAuthentication && !Authentication.isAuthenticated()) {
                    e.preventDefault();
                    $state.go('home', {'notify': false});
                }
            }
        }
       
    }

})();