(function () {
  'use strict';

  angular
    .module('trulii.routes')
    .constant("serverConf", {
        //"url": "http://trulii-back.herokuapp.com",
        "url": "http://localhost:8000",
       
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
                //templateUrl: '/partials/authentication/forgot_password.html
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
                    organizer: getOrganizer,
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
        presaveInfo: getPresaveActivityInfo,
        activity: getActivity,
        organizer : getOrganizer,
      },
      //controllerAs: 'vm',
      templateUrl: 'partials/activities/create.html',
		//templateUrl: 'modalContainer' 
    })

    .state('activties-new.general', {
      url:'',
      controller: 'ActivityGeneralController',
      controllerAs: 'vm',
      templateUrl: 'partials/activities/dashboard_general.html',
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
        presaveInfo: getPresaveActivityInfo,
        activity: getActivity,
        organizer : getOrganizer,
      },
      controllerAs: 'pc',
      templateUrl: 'partials/activities/edit.html',
      //templateUrl: 'modalContainer' 
    })
    .state('activities-edit.general', {
      url:'', 
      controller: 'ActivityGeneralController', 
      controllerAs: 'vm',
      templateUrl: 'partials/activities/dashboard_general.html',
      //templateUrl: 'modalContainer' 
    })
    .state('activities-edit.detail', {
      url:'detail', 
      controller: 'ActivityDBDetailController', 
      // resolve:{
      //   activity : getParentActivity
      // },
      controllerAs: 'vm',
      templateUrl: 'partials/activities/dashboard_detail.html',
      //templateUrl: 'modalContainer' 
    })
    .state('activities-edit.calendars', {
      url:'calendars', 
      controller: 'ActivityCalendarsController', 
      controllerAs: 'vm',
      templateUrl: 'partials/activities/dashboard_calendars.html',
      resolve:{
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
      templateUrl: 'partials/activities/dashboard_location.html',
    })
    .state('activities-edit.instructors', {
      url:'instructors', 
      controller: 'ActivityDBInstructorsController', 
      controllerAs: 'vm',
      templateUrl: 'partials/activities/dashboard_instructors.html',
    })
    .state('activities-edit.gallery', {
      url:'gallery', 
      controller: 'ActivityDBGalleryController', 
      controllerAs: 'vm',
      templateUrl: 'partials/activities/dashboard_gallery.html',
    })
    .state('activities-edit.return-policy', {
      url:'return-policy', 
      controller: 'ActivityDBReturnPDashboard', 
      controllerAs: 'vm',
      templateUrl: 'partials/activities/dashboard_return_policy.html',
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
    if(authenticatedUser){
      is_organizer = authenticatedUser.user_type == 'O' ? true:false;
       
    }

    var result = is_organizer ? new Organizer(authenticatedUser):$q.reject();
    return result
  }

  getOrganizerActivities.$inject = ['ActivitiesManager','organizer'];

  function getOrganizerActivities(ActivitiesManager,organizer){

    return ActivitiesManager.loadOrganizerActivities(organizer.id)


  }

  /****** RESOLVER FUNCTIONS ACTIVITIES *******/


  getAvailableCities.$inject = ['$stateParams','$q','LocationManager'];

  function getAvailableCities($stateParams,$q,LocationManager){

    return LocationManager.getAvailableCities()
  }


  getCalendars.$inject = ['CalendarsManager','activity'];

  function getCalendars( CalendarsManager, activity){
    var calendars = CalendarsManager.loadCalendars(activity.id);
    return calendars;
  }

  getCalendar.$inject = ['$stateParams','CalendarsManager','activity'];

  function getCalendar($stateParams, CalendarsManager, activity){

    var calendar_id = $stateParams.id;
    return CalendarsManager.getCalendar(calendar_id);
  }



  getActivity.$inject = ['$stateParams','ActivitiesManager'];
  
  function getActivity($stateParams,ActivitiesManager){

    return ActivitiesManager.getActivity($stateParams.activity_id)

  }



  getPresaveActivityInfo.$inject = ['ActivitiesManager'];
  
  function getPresaveActivityInfo(ActivitiesManager){

    return ActivitiesManager.loadGeneralInfo()

  }



  /****** RUN METHOD*******/
  run.$inject = ['$rootScope','$state','$urlMatcherFactory','Authentication'];

  function run($rootScope,$state,$urlMatcherFactory,Authentication){


    $urlMatcherFactory.strictMode(false);
    $rootScope.$on('$stateChangeStart',function(e,toState,toParams,fromState){

      $state.previous = fromState;

      if ( !(toState.data) ) return;
      if ( !(toState.data.requiredAuthentication) ) return;

      var _requiredAuthentication = toState.data.requiredAuthentication;

      if (_requiredAuthentication && !Authentication.isAuthenticated()){

        e.preventDefault();
        $state.go('home',{'notify':false});
      }
      return;


    });
  };
})();
