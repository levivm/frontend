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
        var EACTION_BE_ORGANIZER = 'Be Organizer';
        var EACTION_CARD_ACTIVITY_ACTION = 'Card action ';
        var EACTION_CLICK_LOGO_NAVBAR = 'Click logo navbar';
        var EACTION_SIGNUP_EMAIL='Email Sign up complete';
        var EACTION_SIGNUP_FACEBOOK='Facebook Sign up complete';
        var EACTION_BMENU_CLICK='Click item burguer menu ';
        var EACTION_SHARE_SOCIAL='share';
        var EACTION_NOT_FOUND= '404';
        var EACTION_PROMO_BAR = 'Click Promo-bar';
        //Students Actions Labels

        var EACTION_ENROLL_CLICK= 'Click Enroll';
        var EACTION_ENROLL_PAY= 'Enroll Pay';
        var EACTION_ENROLL_SUCCESS= 'Enroll success';
        var EACTION_SEND_REFERRALL = 'Send Referral';
        var EACTION_DO_REVIEW = 'Do Review';
        var EACTION_REFUND = 'Seek Refund';
        var EACTION_DASHBOARD_CLICK= 'Click dashboard item student';
        var EACTION_TRANSACTIONS_STUDENT="Tranasaction section";
        var EACTION_INVITE_NAVBAR= "Click Recibe20000";


        var LABEL_ENROLL_WIDGET='click enroll widget';
        var LABEL_ENROLL_CLICK='click enroll calendar';
        var LABEL_ENROLL_PAY_TDC='enrollSuccess Pay tdc';
        var LABEL_ENROLL_PAY_PSE='enrollSuccess Pay pse';
        var LABEL_ENROLL_FREE='enrollSuccessFree';
        var LABEL_SENT='sent';
        var LABEL_RATING='Rating-';
        var LABEL_SEE_ORDER='See order-';
        var LABEL_SEEK_REFUND='Seek refund-';
        var LABEL_COMPLETE='complet';


        //organizer Actions Labels

        var EACTION_REQUEST_ORGANIZER='Request organizer Form';
        var EACTION_CREATE_ACTIVITY='Click Create Activity Button';
        var EACTION_NEW_ACTIVITY='Click Continue Button';
        var EACTION_CLICK_ITEM_DASHBOARD_A = 'Click Item Dasboard Acitvity';
        var EACTION_BUTTON_PUBLIC_ACT='Click public activity';
        var EACTION_BUTTON_UNPUBLISH_ACT='Click unpublish activity';
        var EACTION_CLICK_ITEM_DASHBOARD_ORG = 'Click Item Dasboard organizer';
        var EACTION_CLICK_ITEM_DASHBOARD_MANAGE = 'Click Item dashboard manage';
        var EACTION_CLICK_MANAGE_NAV='Click Manage activity navbar';
        var EACTION_CLICK_EDIT_NAV='Click Edit activity navbar';
        var EACTION_CLICK_NAVBAR_SECONDARY='CLick navbar secondary item';
        
        
        
        //STRINGS For ecommerce
        
        var EC_ADDIMPRESSION = 'myTracker.ec:addImpression';
        var EC_ADDPRODUCT = 'myTracker.ec:addProduct';
        var EC_SETACTION = 'myTracker.ec:setAction';
        


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
            actionCard:actionCard,
            logoNavbar:logoNavbar,
            shareActivity:shareActivity,
            notFound:notFound,
            promoBar:promoBar
        };

        var studentEvents = {
            enrollWidget:enrollWidget,
            enrollCalendar:enrollCalendar,
            enrollPayTdc:enrollPayTdc,
            enrollPayPse:enrollPayPse,
            enrollSuccessFree:enrollSuccessFree,
            sendReferral:sendReferral,
            doReview:doReview,
            dashboardItemClicks:dashboardItemClicks,
            seeOrder:seeOrder,
            seekRefund:seekRefund,
            inviteNav:inviteNav

        };

        var organizerEvents = {
            requestOrganizer:requestOrganizer,
            clickButtonCreateAcitvity:clickButtonCreateAcitvity,
            newAcitvity:newAcitvity,
            dashboardActivitiesItems:dashboardActivitiesItems,
            publicActity:publicActity,
            unPublishActity:unPublishActity,
            dashboardOrgItems:dashboardOrgItems,
            dashboardManageItem:dashboardManageItem,
            navbarActionSecondary:navbarActionSecondary

        };
        
        var ecommerce = {
            goToActivity:goToActivity,
            detailActivity:detailActivity,
            purchaseActivity:purchaseActivity,
            impressionActivity: impressionActivity,
            detailEnroll:detailEnroll
        }



        var service = {
            init: init,
            sendPageView:sendPageView,
            generalEvents: generalEvents,
            studentEvents:studentEvents,
            organizerEvents:organizerEvents,
            ecommerce:ecommerce

        };


        return service;

        //Init Tracker Events
        function init(){

            var userId = Authentication.isAuthenticated() ? true:false;
            $window.ga_debug = {trace: true};
            $window.ga('create', {
                trackingId: 'UA-67305468-4',
                cookieDomain: 'auto',
                name: 'myTracker',
            });
            
            $window.ga('myTracker.require', 'ec');
            $window.ga('myTracker.set', '&cu', 'COP'); 
            if(userId){
                _setUserId();
            }
            //Test trackingId UA-50130727-5
            //Trulii trackingId UA-67305468-4
            //Test trulii UA-67305468-1
            // Establezca el ID de usuario mediante el user_id con el que haya iniciado sesión.
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
            _setUserId();
            _reportEvent(CATEGORY_GENERAL, eventAction, 'Login-'+data);
        }

        function registerType(registerEmail, data){
            var eventAction = registerEmail ? EACTION_SIGNUP_EMAIL:EACTION_SIGNUP_FACEBOOK;
            _setUserId();
            _reportEvent(CATEGORY_GENERAL, eventAction, 'Signup-'+data);
        }

        function viewActivityDetail(data){
            var eventAction = _userType(EACTION_ACTIVITY_DETAIL);
            _reportEvent(CATEGORY_GENERAL, eventAction, data);
        }

        function burguerMenuItemsClicks(data){
            var eventAction = _userType(EACTION_BMENU_CLICK);
            _reportEvent(CATEGORY_GENERAL, eventAction, data);
            
        }


        function actionCard(data){
            var eventAction = _userType(EACTION_CARD_ACTIVITY_ACTION);
            _reportEvent(CATEGORY_GENERAL, eventAction, data);
        }

        function logoNavbar(){
            var label = _userType('');
            _reportEvent(CATEGORY_GENERAL, EACTION_CLICK_LOGO_NAVBAR, label);
        }
        
        function notFound(url) {
            _reportEvent(CATEGORY_GENERAL, EACTION_NOT_FOUND, 'from: '+url);
        }
        
        function promoBar(url) {
            _reportEvent(CATEGORY_GENERAL, EACTION_PROMO_BAR, url);
        }

        function shareActivity(social, data){
            _reportSocialEvent(social, EACTION_SHARE_SOCIAL, data);
        }
        
        
        
        
        //Sudent Events


        function enrollWidget(){
            _reportEvent(CATEGORY_STUDENT, EACTION_ENROLL_CLICK, LABEL_ENROLL_WIDGET);
        }
        function enrollCalendar(){
            _reportEvent(CATEGORY_STUDENT, EACTION_ENROLL_CLICK, LABEL_ENROLL_CLICK);
        }
        function enrollPayTdc(){
            _reportEvent(CATEGORY_STUDENT, EACTION_ENROLL_SUCCESS, LABEL_ENROLL_PAY_TDC);
        }
        function enrollPayPse(){
            _reportEvent(CATEGORY_STUDENT, EACTION_ENROLL_SUCCESS, LABEL_ENROLL_PAY_PSE);
        }
        function enrollSuccessFree(){
            _reportEvent(CATEGORY_STUDENT, EACTION_ENROLL_SUCCESS, LABEL_ENROLL_FREE);
        }

        function sendReferral(){
            _reportEvent(CATEGORY_STUDENT, EACTION_SEND_REFERRALL, LABEL_SENT);
        }
        function doReview(data){
            _reportEvent(CATEGORY_STUDENT, EACTION_DO_REVIEW, LABEL_RATING+data);
        }
        function dashboardItemClicks(data){
            _reportEvent(CATEGORY_STUDENT, EACTION_DASHBOARD_CLICK, data);
        }

        function seeOrder(data){
            _reportEvent(CATEGORY_STUDENT, EACTION_TRANSACTIONS_STUDENT, LABEL_SEE_ORDER+data);
        }
        function seekRefund(data){
            _reportEvent(CATEGORY_STUDENT, EACTION_TRANSACTIONS_STUDENT, LABEL_SEEK_REFUND+data);
        }
        
        function inviteNav(){
            _reportEvent(CATEGORY_STUDENT, EACTION_INVITE_NAVBAR, LABEL_SENT);
        }


        //Functions Organizer Events

        function requestOrganizer(){
            _reportEvent(CATEGORY_ORGANIZER, EACTION_REQUEST_ORGANIZER, LABEL_COMPLETE);
        }

        function clickButtonCreateAcitvity(){
            _reportEvent(CATEGORY_ORGANIZER, EACTION_CREATE_ACTIVITY, LABEL_COMPLETE);
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

        function dashboardOrgItems(item){
            _reportEvent(CATEGORY_ORGANIZER, EACTION_CLICK_ITEM_DASHBOARD_ORG, item);
        }

        function dashboardManageItem(item){
            _reportEvent(CATEGORY_ORGANIZER, EACTION_CLICK_ITEM_DASHBOARD_MANAGE, item);
        }

        function navbarActionSecondary(item){
            _reportEvent(CATEGORY_ORGANIZER, EACTION_CLICK_NAVBAR_SECONDARY, item);
        }
        
        function _getActivityObject(activity, calendar) {
            var price = 0;
            if(calendar)
                price = activity.is_open ? calendar.price: calendar.session_price;
            else
                price = activity.is_open ? activity.cloest_calendar_package.price : activity.closest_calendar.session_price
            
            price = price ? price:0;
            return  {
                'id': activity.id.toString(),
                'name': activity.title,
                'brand': activity.organizer.name,
                'category': activity.category.name,
                'price': price.toString()
            };
        }
        
        
        //Ecommerce Section
        function impressionActivity(activity, stateName) {
            var dataObject = _getActivityObject(activity);
            dataObject.list=stateName;
            _ecommerceTrack(EC_ADDIMPRESSION, dataObject);
            $window.ga(TRACKER_SEND, 'pageview');
        }
        function goToActivity(activity, stateName) {
            var dataObject = _getActivityObject(activity);
            var dataAction = {       
                'list': stateName         
            }
            _ecommerceTrack(EC_ADDPRODUCT, dataObject);
            _ecommerceAction('click', dataAction);
        }
        
        function detailActivity(activity, calendar) {
            var dataObject = _getActivityObject(activity, calendar);
            _ecommerceTrack(EC_ADDPRODUCT, dataObject);
            _ecommerceAction('detail');
        }
        function detailEnroll(activity, calendar) {
            var dataObject = _getActivityObject(activity, calendar);
            var dataCheckout = {
                'step': 1
            }
            _ecommerceTrack(EC_ADDPRODUCT, dataObject);
            _ecommerceAction('checkout', dataCheckout);
            
        }
        function purchaseActivity(activity, order, calendar) {
            
            var dataObject = _getActivityObject(activity, calendar);
            dataObject.quantity= order.assistants.length;
            var dataAction = {
                'id': order.id.toString(),
                'revenue': order.fee_detail.trulii_total_fee,
                'option': order.is_free ? 'Gratis': 'No es Gratis'
            }
            
            var dataCheckout = {
                'step': 2,
                'option': order.payment.payment_type
            }
            _ecommerceTrack(EC_ADDPRODUCT, dataObject);
            _ecommerceAction('purchase', dataAction);
            _ecommerceAction('checkout', dataCheckout);
        }


        //Send route (page view)
        function sendPageView(){
            $window.ga(TRACKER_SEND, {
              hitType: 'pageview',
              page: $location.path()
            });
        }

        function _userType(label){
            return Authentication.isAuthenticated() ? label+localStorageService.get(USER_KEY).user_type : label+'none';
        }
        function _reportEvent(category, eventAction, data){
            $window.ga(TRACKER_SEND, {
                hitType: HITTYPE_EVENT,
                eventCategory: category,
                eventAction: eventAction,
                eventLabel: data
            });
        }
        
        function  _ecommerceTrack(typeObject, dataObject) {
            $window.ga(typeObject, dataObject);
        }
        
        function _ecommerceAction(typeAction, dataAction) {
            if(dataAction)
                $window.ga(EC_SETACTION, typeAction, dataAction);
            else
                $window.ga(EC_SETACTION, typeAction);
            
            $window.ga(TRACKER_SEND, 'pageview');
        }

        function _reportSocialEvent(social, action, target){
            $window.ga(TRACKER_SEND, {
              hitType: 'social',
              socialNetwork: social,
              socialAction: action,
              socialTarget: target
            });
        }

        function _setUserId(){
            $window.ga('myTracker.set', 'userId', localStorageService.get(USER_KEY).id );
        }

    }

})();
