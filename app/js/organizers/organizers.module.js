/**
 * @ngdoc object
 * @name trulii.organizers
 * @description Trulii Organizers Module
 */

(function () {
    'use strict';

    angular
        .module('trulii.organizers', [
            'trulii.organizers.controllers',
            'trulii.organizers.services',
            'trulii.organizers.directives'
        ])
        .constant('OrganizersTemplatesPath', "partials/organizers/")
        .config(config);

    angular
        .module('trulii.organizers.controllers', ['angularFileUpload']);

    angular
        .module('trulii.organizers.services', []);

     angular
      .module('trulii.organizers.directives',[]);

    //noinspection JSValidateJSDoc
    /**
     * @ngdoc object
     * @name trulii.organizers.config
     * @description Organizers Module Config function
     * @requires ui.router.state.$stateProvider
     */
    config.$inject = ['$stateProvider'];
    function config($stateProvider) {
        $stateProvider
            .state('organizer-landing', {
                url:'/organizers/landing/',
                controller: 'OrganizerLandingCtrl as landing',
                templateUrl: 'partials/organizers/landing.html',
                params: {
                  from_menu: null
                },
                resolve:{
                    cities: getAvailableCities
                },
                data:{
                    pageTitle:'Sé Organizador y Publica Tus Cursos| Trulii',
                    pageDescription: 'Conviértete en organizador y publica tus cursos, talleres, clases o diplomados de manera sencilla y rápida. Publicar es GRATIS. Más información aquí.'
                }
            })
            .state('organizer-profile', {
                url: '/organizers/{organizer_id:int}/:organizer_name',
                params: {
                  organizer_name: {value: null, squash: true}
                },
                controller: 'OrganizerProfileController as profile',
                templateUrl: 'partials/organizers/profile.html',
                resolve: {
                    organizer: getOrganizer,
                    activities: getOrganizerProfileActivities,
                    reviews: getOrganizerReviews,
                    reviewObjects: getReviewObjects
                }
            })
            .state('organizer-dashboard', {
                abstract:true,
                url:'/organizer/dashboard/',
                controller: 'OrganizerDashboardCtrl as dash',
                templateUrl: 'partials/organizers/dashboard.html',
                resolve:{
                    cities: getAvailableCities,
                    organizer: getCurrentOrganizer,
                    unreadReviews: getOrganizerUnreadReviews,
                    unreadReviewObjects: getUnreadReviewObjects,
                    unreadReviewsCount: getUnreadOrganizerReviewsCount
                },
                data: {
                    requiredAuthentication : true
                }
            })
            .state('organizer-dashboard.account', {
                url:'account/',
                controller: 'OrganizerAccountCtrl as account',
                templateUrl: 'partials/organizers/dashboard/account.html',
                resolve: {
                    bankingInfo: getBankingInfo,
                    bankingData: getBankingData
                }
            })
            .state('organizer-dashboard.account.settings', {
                url:'settings',
                templateUrl: 'partials/organizers/dashboard/account_settings.html'
            })
            .state('organizer-dashboard.account.banking', {
                url:'banking',
                templateUrl: 'partials/organizers/dashboard/account_banking.html'
            })
            .state('organizer-dashboard.activities', {
                url:'activities/',
                controller: 'OrganizerActivitiesCtrl as activities',
                templateUrl: 'partials/organizers/dashboard/activities.html',
                resolve: {
                    openActivities: getOrganizerOpenActivities,
                    closedActivities: getOrganizerClosedActivities,
                    inactiveActivities: getOrganizerInactiveActivities
                }
            })
            .state('organizer-dashboard.activities.open', {
                url:'open',
                templateUrl: 'partials/organizers/dashboard/activities_open.html'
            })
            .state('organizer-dashboard.activities.closed', {
                url:'closed',
                templateUrl: 'partials/organizers/dashboard/activities_closed.html'
            })
            .state('organizer-dashboard.activities.inactive', {
                url:'inactive',
                templateUrl: 'partials/organizers/dashboard/activities_inactive.html'
            })
            .state('organizer-dashboard.instructors', {
                url:'instructors/',
                controller: 'OrganizerInstructorsCtrl as instructors',
                templateUrl: 'partials/organizers/dashboard/instructors.html'
            })
            .state('organizer-dashboard.transactions', {
                url:'transactions/',
                controller: 'OrganizerTransactionsCtrl as transactions',
                templateUrl: 'partials/organizers/dashboard/transactions.html',
                resolve: {
                    orders: getOrders,
                    balances: getBalances,
                    withdraws: getWithDraw,
                    bankingInfo: getBankingInfo,
                    activities: getOrganizerActivityList,
                    bankingData: getBankingData
                }
            })
            .state('organizer-dashboard.transactions.sales', {
                url:'sales',
                templateUrl: 'partials/organizers/dashboard/transactions_sales.html'
            })
            .state('organizer-dashboard.transactions.balance', {
                url:'balance',
                templateUrl: 'partials/organizers/dashboard/transactions_balance.html'
            })
            .state('organizer-dashboard.transactions.withdrawals', {
                url:'withdrawals',
                templateUrl: 'partials/organizers/dashboard/transactions_withdrawals.html'
            })
            .state('organizer-dashboard.profile', {
                url:'profile',
                controller: 'OrganizerProfileCtrl as profile',
                templateUrl: 'partials/organizers/dashboard/profile.html'
            })
            .state('organizer-dashboard.reviews', {
                url:'reviews/',
                controller: 'OrganizerReviewsCtrl as reviews',
                templateUrl: 'partials/organizers/dashboard/reviews.html',
                resolve: {
                    activities: getOrganizerOpenActivities,
                    unreadReviews: getOrganizerUnreadReviews,
                    readReviews: getOrganizerReadReviews,
                    unreadReviewObjects: getUnreadReviewObjects,
                    readReviewObjects: getReadReviewObjects
                }
            })
            .state('organizer-dashboard.reviews.done', {
                url:'done',
                templateUrl: 'partials/organizers/dashboard/reviews_done.html'
            })
            .state('organizer-dashboard.reviews.pending', {
                url:'pending',
                templateUrl: 'partials/organizers/dashboard/reviews_pending.html'
            });

        /**
         * @ngdoc method
         * @name .#getCurrentOrganizer
         * @description Retrieves the current logged Organizer from
         * {@link trulii.organizers.services.OrganizersManager OrganizersManager} Service otherwise returns ``null``
         * @requires ng.$timeout
         * @requires ui.router.state.$state
         * @requires ng.$q
         * @requires trulii.organizers.services.OrganizersManager
         * @methodOf trulii.organizers.config
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
         * @name .#getPayUData
         * @description Retrieves an Organizer from
         * {@link trulii.organizers.services.OrganizersManager OrganizersManager} Service with
         * the provided ``organizer_id`` from $stateParams
         * @requires ui.router.state.$stateParams
         * @requires trulii.organizers.services.OrganizersManager
         * @methodOf trulii.organizers.config
         */
        getOrganizer.$inject = ['$stateParams', 'OrganizersManager'];
        function getOrganizer($stateParams, OrganizersManager) {
            return OrganizersManager.getOrganizer($stateParams.organizer_id);
        }

        /**
         * @ngdoc method
         * @name .#getOrganizerOpenActivities
         * @description Retrieves an Organizer's Open Activities from
         * {@link trulii.activities.services.ActivitiesManager ActivitiesManager} Service with its ID and status
         * @requires trulii.activities.services.ActivitiesManager
         * @requires organizer
         * @methodOf trulii.organizers.config
         */
        getOrganizerOpenActivities.$inject = ['ActivitiesManager','organizer'];
        function getOrganizerOpenActivities(ActivitiesManager, organizer){
            return ActivitiesManager.loadOrganizerActivities(organizer.id, 'opened');
        }

        /**
         * @ngdoc method
         * @name .#getOrganizerOpenActivities
         * @description Retrieves an Organizer's Open Activities from
         * {@link trulii.activities.services.ActivitiesManager ActivitiesManager} Service with its ID and status
         * @requires trulii.activities.services.ActivitiesManager
         * @requires organizer
         * @methodOf trulii.organizers.config
         */
        getOrganizerProfileActivities.$inject = ['ActivitiesManager','organizer'];
        function getOrganizerProfileActivities(ActivitiesManager, organizer){
            return ActivitiesManager.loadOrganizerActivities(organizer.id, 'opened', 1, 8);
        }


        /**
         * @ngdoc method
         * @name .#getOrganizerClosedActivities
         * @description Retrieves an Organizer's Closed Activities from
         * {@link trulii.activities.services.ActivitiesManager ActivitiesManager} Service with its ID and status
         * @requires trulii.activities.services.ActivitiesManager
         * @requires organizer
         * @methodOf trulii.organizers.config
         */
        getOrganizerClosedActivities.$inject = ['ActivitiesManager','organizer'];
        function getOrganizerClosedActivities(ActivitiesManager, organizer){
            return ActivitiesManager.loadOrganizerActivities(organizer.id, 'closed');
        }

        /**
         * @ngdoc method
         * @name .#getOrganizerInactiveActivities
         * @description Retrieves an Organizer's Inactive Activities from
         * {@link trulii.activities.services.ActivitiesManager ActivitiesManager} Service with its ID and status
         * @requires trulii.activities.services.ActivitiesManager
         * @requires organizer
         * @methodOf trulii.organizers.config
         */
        getOrganizerInactiveActivities.$inject = ['ActivitiesManager','organizer'];
        function getOrganizerInactiveActivities(ActivitiesManager, organizer){
            return ActivitiesManager.loadOrganizerActivities(organizer.id, 'unpublished');
        }

        /**
         * @ngdoc method
         * @name .#getOrders
         * @description Retrieves an Organizer's Orders
         * @requires organizer
         * @methodOf trulii.organizers.config
         */
        getOrders.$inject = ['organizer'];
        function getOrders(organizer){
            return organizer.getOrders();
        }


        /**
         * @ngdoc method
         * @name .#getBalances
         * @description Retrieves an Organizer's Balances
         * @requires organizer
         * @methodOf trulii.organizers.config
         */
        getBalances.$inject = ['organizer'];
        function getBalances(organizer){
            return organizer.getBalances();
        }
        /**
         * @ngdoc method
         * @name .#getWithDraws
         * @description Retrieves an Organizer's withdraws
         * @requires organizer
         * @methodOf trulii.organizers.config
         */
        getBalances.$inject = ['organizer'];
        function getWithDraw(organizer){
            return organizer.getWithDraw();
        }

        /**
         * @ngdoc method
         * @name .#getOrganizerR  eadReviews
         * @description Retrieves an Organizer's Unread Reviews from
         * {@link trulii.organizers.services.Organizer Organizer}
         * @requires organizer
         * @methodOf trulii.organizers.config
         */
        getOrganizerReviews.$inject = ['organizer'];
        function getOrganizerReviews(organizer){
            return organizer.getReviews(1, 10);
        }

        /**
         * @ngdoc method
         * @name .#getOrganizerUnreadReviews
         * @description Retrieves an Organizer's Unread Reviews from
         * {@link trulii.organizers.services.Organizer Organizer}
         * @requires organizer
         * @methodOf trulii.organizers.config
         */
        getOrganizerUnreadReviews.$inject = ['organizer'];
        function getOrganizerUnreadReviews(organizer){
            return organizer.getReviews(1, 6, 'unread');
        }

        /**
         * @ngdoc method
         * @name .#getOrganizerReadReviews
         * @description Retrieves an Organizer's Read Reviews from
         * {@link trulii.organizers.services.Organizer Organizer}
         * @requires organizer
         * @methodOf trulii.organizers.config
         */
        getOrganizerReadReviews.$inject = ['organizer'];
        function getOrganizerReadReviews(organizer){
            return organizer.getReviews(1, 6, 'read');
        }


        /**
         * @ngdoc method
         * @name .#getReviewObjects
         * @description Creates ReviewObjects, simple objects containing a review and the activity it's tied to
         * @requires reviews
         * @requires activities
         * @methodOf trulii.organizers.config
         */
        getReviewObjects.$inject = ['reviews', 'ActivitiesManager'];
        function getReviewObjects(reviews, ActivitiesManager){

            return reviews.results.map(mapActivityToReview);

            function mapActivityToReview(review){

              ActivitiesManager.getActivity(review.activity)
              .then(
                function(response){
                  review.activity = response;
                }
              );

              return review;

            }
        }
        /**
         * @ngdoc method
         * @name .#getReviewObjects
         * @description Creates ReviewObjects, simple objects containing a review and the activity it's tied to
         * @requires reviews
         * @requires activities
         * @methodOf trulii.organizers.config
         */
        getUnreadReviewObjects.$inject = ['unreadReviews', 'ActivitiesManager'];
        function getUnreadReviewObjects(unreadReviews, ActivitiesManager){

            return unreadReviews.results.map(mapActivityToReview);

            function mapActivityToReview(review){

              ActivitiesManager.getActivity(review.activity)
              .then(
                function(response){
                  review.activity = response;
                }
              );

              return review;

            }
        }

        /**
         * @ngdoc method
         * @name .#getReviewObjects
         * @description Creates ReviewObjects, simple objects containing a review and the activity it's tied to
         * @requires reviews
         * @requires activities
         * @methodOf trulii.organizers.config
         */
        getReadReviewObjects.$inject = ['readReviews', 'ActivitiesManager', '$http'];
        function getReadReviewObjects(readReviews, ActivitiesManager, $http){

            return readReviews.results.map(mapActivityToReview);

            function mapActivityToReview(review){

              ActivitiesManager.getActivity(review.activity)
              .then(
                function(response){
                  review.activity = response;
                }
              );

              return review;

            }
        }




        /**
         * @ngdoc method
         * @name .#getUnreadOrganizerReviewsCount
         * @description Retrieves an Organizer's Unread Reviews Count from
         * {@link trulii.organizers.services.Organizer Organizer}
         * @requires organizer
         * @methodOf trulii.organizers.config
         */
        getUnreadOrganizerReviewsCount.$inject = ['unreadReviews'];
        function getUnreadOrganizerReviewsCount(unreadReviews){
            console.log(unreadReviews.count);
            return unreadReviews.count;
        }

        /**
         * @ngdoc method
         * @name .#getUnreadReviewsCount
         * @description Retrieves an Organizer's Unread Reviews from
         * {@link trulii.organizers.services.Organizer Organizer}
         * @requires organizer
         * @methodOf trulii.organizers.config
         */
        getUnreadReviewsCount.$inject = ['$q', 'reviews'];
        function getUnreadReviewsCount($q, reviews){
          console.log(reviews.count.length);
            return {
                'count':reviews.count.length
            };
        }

        /**
         * @ngdoc method
         * @name .#getAvailableCities
         * @description Retrieves all available cities from
         * {@link trulii.locations.services.LocationManager LocationManager} Service
         * @requires trulii.locations.services.LocationManager
         * @methodOf trulii.organizers.config
         */
        getAvailableCities.$inject = ['LocationManager'];
        function getAvailableCities(LocationManager){
            return LocationManager.getAvailableCities();
        }

        /**
         * @ngdoc method
         * @name .#getBankingInfo
         * @description Retrieves Banking Choices Info from
         * {@link trulii.payments.services.Payments Payments} Service
         * @requires trulii.payments.services.Payments
         * @methodOf trulii.organizers.config
         */
        getBankingInfo.$inject = ['Payments'];
        function getBankingInfo(Payments){
            return Payments.getBankingInfo();
        }
        
        getOrganizerActivityList.$inject = ['organizer'];
        function getBankingData(organizer){
            return  organizer.getBankingInfo();
        }

        /**
         * @ngdoc method
         * @name .#getOrganizerActivityList
         * @description Retrieves Activity List from
         * {@link trulii.payments.services.Payments Payments} Service
         * @requires trulii.payments.services.Payments
         * @methodOf trulii.organizers.config
         */
        getOrganizerActivityList.$inject = ['organizer'];
        function getOrganizerActivityList(organizer){
          return organizer.getActivityList();
        }
    }
})();
