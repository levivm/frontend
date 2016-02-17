/**
 * @ngdoc service
 * @name trulii.utils.services.Analytics
 * @description Error Handling Service
 */

(function () {
    'use strict';

    angular
        .module('trulii.utils.services')
        .factory('Analytics', Analytics);

    Analytics.$inject = ['$window', 'Authentication', 'localStorageService', '$location', '$rootScope'];

    function Analytics($window, Authentication, localStorageService, $location, $rootScope) {

        var USER_KEY='user';
        var CATEGORY_GENERAL = 'General';
        var CATEGORY_ORGANIZER = 'Organizer';
        var CATEGORY_STUDENT = 'Student'
        var TRACKER_SEND = 'myTracker.send'
        var HITTYPE_EVENT = 'event';

        //General Actions Labels

        var EACTION_SEARCH_QUERY = 'Query Search';
        var EACTION_SEARCH_CATEGORY = 'Category Search';
        var EACTION_SEARCH_SUBCATEGORY = 'SubCategory Search';
        var EACTION_SEARCH_WEEKENDS= 'Weekends Search';
        var EACTION_SEARCH_CERTIFICATE= 'Certificate Search';
        var EACTION_SEARCH_RANGE= 'Range Search';
        var EACTION_SEARCH_LEVEL= 'Level Search';
        var EACTION_SEARCH_DATE= 'Date Search';
        var EACTION_SEARCH_LANDING_CATEGORY = 'Category landing Search';
        var EACTION_CONTACTUS_SENT = 'ContactUs Form'


        var generalEvents = {
            search:search,
            contactUs:contactUs,
            EACTION_SEARCH_QUERY:EACTION_SEARCH_QUERY,
            EACTION_SEARCH_CATEGORY:EACTION_SEARCH_CATEGORY,
            EACTION_SEARCH_SUBCATEGORY: EACTION_SEARCH_SUBCATEGORY,
            EACTION_SEARCH_LANDING_CATEGORY: EACTION_SEARCH_LANDING_CATEGORY,
            EACTION_SEARCH_CERTIFICATE: EACTION_SEARCH_CERTIFICATE,
            EACTION_SEARCH_LEVEL:EACTION_SEARCH_LEVEL,
            EACTION_SEARCH_DATE: EACTION_SEARCH_DATE,
            EACTION_SEARCH_RANGE:EACTION_SEARCH_RANGE

        };

        var organizerEvents = {

        };

        var studentEvents = {

        };


        //noinspection UnnecessaryLocalVariableJS
        var service = {
            init: init,
            sendPageView:sendPageView,
            generalEvents: generalEvents
        };

        //Init Tracker Events
        function init(){

            var user = Authentication.isAuthenticated() ? localStorageService.get(USER_KEY).user.email : 'none';
            window.ga('create', {
                trackingId: 'UA-50130727-5',
                cookieDomain: 'none',
                name: 'myTracker',
                userId: user
            });
        }


        //General Events
        function search(data, action){
            window.ga(TRACKER_SEND, {
                hitType: HITTYPE_EVENT,
                eventCategory: CATEGORY_GENERAL,
                eventAction: action,
                eventLabel: data
            });
        }

        function contactUs(){
            window.ga(TRACKER_SEND, {
                hitType: HITTYPE_EVENT,
                eventCategory: CATEGORY_GENERAL,
                eventAction: EACTION_CONTACTUS_SENT,
                eventLabel: 'Sent contact form'
            });
        }


        // Internal Functions

        //Send route (page view)
        function sendPageView(){
            ga(TRACKER_SEND, {
              hitType: 'pageview',
              page: $location.path()
            });
        }

        return service;


    }

})();
