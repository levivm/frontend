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

    Referrals.$inject = ['$q', '$http', 'ReferralServerApi'];

    function Referrals($q, $http, ReferralServerApi) {

        var api = ReferralServerApi;

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
             * @name .#getReferrer
             * @description Requests a Referrer object
             * @param {string} referrerCode The referrer's code
             * @return {promise} Referrer Object Promise
             * @methodOf trulii.referrals.services.Referrals
             */
            getReferrer: getReferrer
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

        function getReferrer(referrerCode){
            return $http.get(api.referrer(referrerCode)).then(success, error);

            function success(response){
                return response.data;
            }

            function error(response){
                console.log('Error retrieving coupon with code ', couponCode, ":", response.data);
                return $q.reject(response.data);
            }
        }
    }
})();
