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
            //'trulii.organizers.directives'
        ])
        .config(config);


    angular
        .module('trulii.organizers.controllers', ['angularFileUpload']);

    angular
        .module('trulii.organizers.services', ['ngCookies']);

    // angular
    //  .module('trulii.organizer.directives',[]);

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
                controller: 'OrganizerLandingCtrl',
                controllerAs: 'vm',
                templateUrl: 'partials/organizers/landing.html',
                resolve:{
                    cities: getAvailableCities
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
            })
            .state('organizer-dashboard.account', {
                url:'account/',
                controller: 'OrganizerAccountCtrl as account',
                templateUrl: 'partials/organizers/dashboard/account.html'
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
                    activities: getOrganizerActivities
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
            .state('organizer-dashboard.transactions', {
                url:'transactions/',
                controller: 'OrganizerTransactionsCtrl as transactions',
                templateUrl: 'partials/organizers/dashboard/transactions.html'
            })
            .state('organizer-dashboard.transactions.sales', {
                url:'sales',
                templateUrl: 'partials/organizers/dashboard/transactions_sales.html'
            })
            .state('organizer-dashboard.transactions.reimbursements', {
                url:'reimbursements',
                templateUrl: 'partials/organizers/dashboard/transactions_reimbursements.html'
            })
            .state('organizer-dashboard.profile', {
                url:'profile',
                controller: 'OrganizerProfileCtrl as profile',
                templateUrl: 'partials/organizers/dashboard/profile.html'
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
         * @name .#getOrganizerActivities
         * @description Retrieves an Organizer's Activities from
         * {@link trulii.activities.services.ActivitiesManager ActivitiesManager} Service with its ID
         * @requires trulii.activities.services.ActivitiesManager
         * @requires organizer
         * @methodOf trulii.organizers.config
         */
        getOrganizerActivities.$inject = ['ActivitiesManager','organizer'];
        function getOrganizerActivities(ActivitiesManager, organizer){
            return ActivitiesManager.loadOrganizerActivities(organizer.id);
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
    }

})();