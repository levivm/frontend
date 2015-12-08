/**
 * @ngdoc service
 * @name trulii.referrals.services.Referrals
 * @description Referrals Service
 * @requires ng.$http
 * @requires ng.$q
 * @requires trulii.referrals.services.ReferralServerApi
 */

(function () {
    'use strict';

    angular
        .module('trulii.referrals.services')
        .factory('Referrals', Referrals);

    Referrals.$inject = ['$q', '$http', '$cookies', 'localStorageService', 'ReferralServerApi'];

    function Referrals($q, $http, $cookies, localStorageService, ReferralServerApi) {

        var api = ReferralServerApi;
        var KEY_REF_HASH = 'refhash';

        //noinspection UnnecessaryLocalVariableJS
        var service = {

            /**
             * @ngdoc function
             * @name .#getCoupon
             * @description Requests a Coupon object from its redeem code
             * @param {number} couponCode The redeem code of the Coupon being requested
             * @return {promise} Coupon Object Promise
             * @methodOf trulii.referrals.services.Referrals
             */
            getCoupon: getCoupon,

            /**
             * @ngdoc function
             * @name .#getRefHash
             * @description Returns the stored refHash, `null` otherwise
             * @return {string} refHash
             * @methodOf trulii.referrals.services.Referrals
             */
            getRefHash: getRefHash,

            /**
             * @ngdoc function
             * @name .#deleteRefHash
             * @description Deletes the stored refHash
             * @methodOf trulii.referrals.services.Referrals
             */
            deleteRefHash: deleteRefHash,

            /**
             * @ngdoc function
             * @name .#getReferrer
             * @description Requests a Referrer object
             * @param {string} referrerCode The referrer's code
             * @return {promise} Referrer Object Promise
             * @methodOf trulii.referrals.services.Referrals
             */
            getReferrer: getReferrer,

            /**
             * @ngdoc function
             * @name .#getInviteUrl
             * @description Requests a Referrer referral url
             * @param {string} referrerCode The referrer's code
             * @return {promise} Referrer Object Promise
             * @methodOf trulii.referrals.services.Referrals
             */
            getInviteUrl: getInviteUrl,

            /**
             * @ngdoc function
             * @name .#postInvite
             * @description Posts invites to a comma separated group of emails
             * @param {string} emails Emails string
             * @methodOf trulii.referrals.services.Referrals
             */
            postInvite: postInvite,

            KEY_REF_HASH: KEY_REF_HASH
        };

        return service;

        function getCoupon(couponCode){
            return $http.get(api.coupon(couponCode)).then(success, error);

            function success(response){
                return response.data;
            }

            function error(response){
                console.log('Error retrieving coupon with code ', couponCode, ":", response.data);
                return $q.reject(response.data);
            }
        }

        function getRefHash(){
            return $cookies[KEY_REF_HASH];
        }

        function deleteRefHash(){
            if($cookies[KEY_REF_HASH]){
                delete $cookies[KEY_REF_HASH];
            }
        }

        function getReferrer(referrerCode){
            return $http.get(api.referrer(referrerCode)).then(success, error);

            function success(response){
                if(response.data.hasOwnProperty(KEY_REF_HASH)){ $cookies[KEY_REF_HASH] = response.data[KEY_REF_HASH]; }
                return response.data;
            }

            function error(response){
                console.log('Error retrieving referrer with code ', referrerCode, ":", response.data);
                return $q.reject(response.data);
            }
        }

        function getInviteUrl(){
            return $http.get(api.invite()).then(success, error);

            function success(response){
                return response.data.invite_url;
            }

            function error(response){
                console.log('Error retrieving invite URL', response.data);
                return $q.reject(response.data);
            }
        }

        function postInvite(emails){
            return $http.post(api.invite(), {emails: emails}).then(success, error);

            function success(response){
                return response.data;
            }

            function error(response){
                console.log('Error posting invites', response.data);
                return $q.reject(response.data);
            }
        }
    }
})();
