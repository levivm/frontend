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
        var EACTION_CONTACTUS_SENT = 'ContactUs Form';
        var EACTION_LOGIN_EMAIL = 'Login Email';
        var EACTION_LOGIN_FACEBOOK = 'Login Facebook';
        var EACTION_ACTIVITY_DETAIL = 'Activity detail-';
        var EACTION_BE_ORGANIZER = 'Be Organizer'

        var EACTION_SIGNUP_STUDENT_COMPLETE='Sign up student complete';
        var EACTION_ENROLL_WIDGET= 'Click Enroll widget';
        var EACTION_ENROLL_CALENDAR = 'Click Enroll calendar section';
        var EACTION_ENROLL_PAY_PSE= 'Enroll pay PSE';
        var EACTION_ENROLL_PAY_TDC= 'Enroll pay TDC';
        var EACTION_ENROLL_SUCCESS= 'Enroll success';
        var EACTION_SEND_REFERRALL = 'Send Referral';
        var EACTION_DO_REVIEW = 'Do Review';
        var EACTION_REFUND = 'Seek Refund';
        var EACTION_DASHBOARD_ACTIVITIES= 'Click dashboard Acitivities student';
        var EACTION_DASHBOARD_ACCOUNT = 'Click dashboard account student';
        var EACTION_DASHBOARD_TRANSACTIONS = 'Click dashboard transactions student'

        var generalEvents = {
            searchQuery:searchQuery,
            searchCategory:searchCategory,
            searchSubCategory:searchSubCategory,
            searchCertificate:searchCertificate,
            searchRange:searchRange,
            searchLevel: searchLevel,
            searchDate:searchDate,
            searchWeekends:searchWeekends,
            searchCategoryLanding:searchCategoryLanding,
            contactUs:contactUs,
            loginType:loginType,
            viewActivityDetail:viewActivityDetail
        };

        var studentEvents = {
            sendEventStudent:sendEventStudent
        };

        var organizerEvents = {

        };



        //noinspection UnnecessaryLocalVariableJS
        var service = {
            init: init,
            sendPageView:sendPageView,
            generalEvents: generalEvents
        };


        return service;

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

        function searchQuery(data){
            _reportEvent(CATEGORY_GENERAL, EACTION_SEARCH_QUERY, data);
        }

        function searchCategory(data){
            _reportEvent(CATEGORY_GENERAL, EACTION_SEARCH_CATEGORY, data);
        }
        function searchSubCategory(data){
            _reportEvent(CATEGORY_GENERAL, EACTION_SEARCH_SUBCATEGORY, data);
        }
        function searchCertificate(data){
            _reportEvent(CATEGORY_GENERAL, EACTION_SEARCH_CERTIFICATE, data);
        }
        function searchRange(data){
            _reportEvent(CATEGORY_GENERAL, EACTION_SEARCH_RANGE, data);
        }
        function searchLevel(data){
            _reportEvent(CATEGORY_GENERAL, EACTION_SEARCH_LEVEL, data);
        }
        function searchWeekends(data){
            _reportEvent(CATEGORY_GENERAL, EACTION_SEARCH_WEEKENDS, data);
        }
        function searchDate(data){
            _reportEvent(CATEGORY_GENERAL, EACTION_SEARCH_DATE, data);
        }
        function searchCategoryLanding(data){
            _reportEvent(CATEGORY_GENERAL, EACTION_SEARCH_LANDING_CATEGORY, data);
        }

        function contactUs(data){
            _reportEvent(CATEGORY_GENERAL, EACTION_CONTACTUS_SENT, data);
        }

        function loginType(loginEmail, data){
            var eventAction = loginEmail ? EACTION_LOGIN_EMAIL:EACTION_LOGIN_FACEBOOK;
            _reportEvent(CATEGORY_GENERAL, eventAction, data);
        }

        function viewActivityDetail(data){
            var eventAction = Authentication.isAuthenticated() ? EACTION_ACTIVITY_DETAIL+localStorageService.get(USER_KEY).user_type : EACTION_ACTIVITY_DETAIL+'none';
            _reportEvent(CATEGORY_GENERAL, eventAction, data);
        }






        //Sudent Events

        function sendEventStudent(eventAction, data){
            window.ga(TRACKER_SEND, {
                hitType: HITTYPE_EVENT,
                eventCategory: CATEGORY_STUDENT,
                eventAction: eventAction,
                eventLabel: data
            });
        }





        //Send route (page view)
        function sendPageView(){
            ga(TRACKER_SEND, {
              hitType: 'pageview',
              page: $location.path()
            });
        }

        function _reportEvent(category, eventAction, data){
            window.ga(TRACKER_SEND, {
                hitType: HITTYPE_EVENT,
                eventCategory: category,
                eventAction: eventAction,
                eventLabel: data
            });
        }


    }

})();
