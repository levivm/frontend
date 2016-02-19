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

        var EACTION_SIGNUP_EMAIL='Email Sign up complete';
        var EACTION_SIGNUP_FACEBOOK='Facebook Sign up complete';
        var EACTION_ENROLL_CLICK= 'Click Enroll';
        var EACTION_ENROLL_PAY= 'Enroll Pay';
        var EACTION_ENROLL_SUCCESS= 'Enroll success';
        var EACTION_SEND_REFERRALL = 'Send Referral';
        var EACTION_DO_REVIEW = 'Do Review';
        var EACTION_REFUND = 'Seek Refund';
        var EACTION_DASHBOARD_CLICK= 'Click dashboard item';
        var EACTION_BMENU_CLICK='Click item burguer menu ';
        var EACTION_TRANSACTIONS_STUDENT="Tranasaction section";

        var EACTION_REQUEST_ORGANIZER='Request organizer Form';
        var EACTION_CREATE_ACTIVITY='Click Create Activity Button';
        var EACTION_NEW_ACTIVITY='Click Continue Button';
        var EACTION_CLICK_ITEM_DASHBOARD_A = 'Click Item Dasboard Acitvity';
        var EACTION_BUTTON_PUBLIC_ACT='Click public activity';
        var EACTION_BUTTON_UNPUBLISH_ACT='Click unpublish activity';


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
            viewActivityDetail:viewActivityDetail,
            registerType:registerType,
            burguerMenuItemsClicks:burguerMenuItemsClicks,
        };

        var studentEvents = {
            sendEventStudent:sendEventStudent,
            enrollWidget:enrollWidget,
            enrollCalendar:enrollCalendar,
            enrollPayTdc:enrollPayTdc,
            enrollPayPse:enrollPayPse,
            enrollSuccessFree:enrollSuccessFree,
            sendReferral:sendReferral,
            doReview:doReview,
            dashboardItemClicks:dashboardItemClicks,
            seeOrder:seeOrder,
            seekRefund:seekRefund

        };

        var organizerEvents = {
            requestOrganizer:requestOrganizer,
            clickButtonCreateAcitvity:clickButtonCreateAcitvity,
            newAcitvity:newAcitvity,
            dashboardActivitiesItems:dashboardActivitiesItems,
            publicActity:publicActity,
            unPublishActity:unPublishActity
        };



        //noinspection UnnecessaryLocalVariableJS
        var service = {
            init: init,
            sendPageView:sendPageView,
            generalEvents: generalEvents,
            studentEvents:studentEvents,
            organizerEvents:organizerEvents
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

        //Functions Organizer Events

        function requestOrganizer(){
            _reportEvent(CATEGORY_ORGANIZER, EACTION_REQUEST_ORGANIZER, 'complete');
        }

        function clickButtonCreateAcitvity(){
            _reportEvent(CATEGORY_ORGANIZER, EACTION_CREATE_ACTIVITY, 'complete');
        }

        function newAcitvity(data){
            _reportEvent(CATEGORY_ORGANIZER, EACTION_NEW_ACTIVITY, data);
        }
        function dashboardActivitiesItems(item){
            _reportEvent(CATEGORY_ORGANIZER, EACTION_CLICK_ITEM_DASHBOARD_A, item);
        }
        function publicActity(data){
            _reportEvent(CATEGORY_ORGANIZER, EACTION_BUTTON_PUBLIC_ACT, data);
        }
        function unPublishActity(data){
            _reportEvent(CATEGORY_ORGANIZER, EACTION_BUTTON_UNPUBLISH_ACT, data);
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
            _reportEvent(CATEGORY_GENERAL, eventAction, 'Login-'+data);
        }

        function registerType(registerEmail, data){
            var eventAction = registerEmail ? EACTION_SIGNUP_EMAIL:EACTION_SIGNUP_FACEBOOK;
            _reportEvent(CATEGORY_GENERAL, eventAction, 'Signup-'+data);
        }

        function viewActivityDetail(data){
            var eventAction = Authentication.isAuthenticated() ? EACTION_ACTIVITY_DETAIL+localStorageService.get(USER_KEY).user_type : EACTION_ACTIVITY_DETAIL+'none';
            _reportEvent(CATEGORY_GENERAL, eventAction, data);
        }

        function burguerMenuItemsClicks(data){
            var eventAction = Authentication.isAuthenticated() ? EACTION_BMENU_CLICK+localStorageService.get(USER_KEY).user_type : EACTION_BMENU_CLICK+'none';
            _reportEvent(CATEGORY_STUDENT, eventAction, data);
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

        function enrollWidget(){
            _reportEvent(CATEGORY_STUDENT, EACTION_ENROLL_CLICK, 'click enroll widget');
        }
        function enrollCalendar(){
            _reportEvent(CATEGORY_STUDENT, EACTION_ENROLL_CLICK, 'click enroll calendar');
        }
        function enrollPayTdc(){
            _reportEvent(CATEGORY_STUDENT, EACTION_ENROLL_SUCCESS, 'enrollSuccess Pay tdc');
        }
        function enrollPayPse(){
            _reportEvent(CATEGORY_STUDENT, EACTION_ENROLL_SUCCESS, 'enrollSuccess Pay pse');
        }
        function enrollSuccessFree(){
            _reportEvent(CATEGORY_STUDENT, EACTION_ENROLL_SUCCESS, 'enrollSuccessFree');
        }

        function sendReferral(){
            _reportEvent(CATEGORY_STUDENT, EACTION_SEND_REFERRALL, 'sent');
        }
        function doReview(data){
            _reportEvent(CATEGORY_STUDENT, EACTION_DO_REVIEW, 'Rating: '+data);
        }
        function dashboardItemClicks(data){
            _reportEvent(CATEGORY_STUDENT, EACTION_DASHBOARD_CLICK, data);
        }

        function seeOrder(data){
            _reportEvent(CATEGORY_STUDENT, EACTION_TRANSACTIONS_STUDENT, 'See order-'+data);
        }
        function seekRefund(data){
            _reportEvent(CATEGORY_STUDENT, EACTION_TRANSACTIONS_STUDENT, 'Seek Refund-'+data);
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
