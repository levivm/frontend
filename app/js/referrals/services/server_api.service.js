/**
 * @ngdoc service
 * @name trulii.referrals.services.ReferralServerApi
 * @description API Service for Activity related Endpoints
 * @requires trulii.routes.serverConf
 */
(function () {
    'use strict';

    angular
        .module('trulii.referrals.services')
        .factory('ReferralServerApi', ReferralServerApi);

    ReferralServerApi.$inject = ['serverConf'];

    function ReferralServerApi(serverConf) {

        var serverApi = serverConf.url + '/api/';
        var debug = false;

        //noinspection UnnecessaryLocalVariableJS
        var api = {

            /**
             * @ngdoc function
             * @name .#coupon
             * @description Renders **`/api/coupons/:couponCode`** Coupon validation URL
             * @param {string} couponCode The code of the coupon being redeemed
             * @return {string} Rendered URL
             * @methodOf trulii.referrals.services.ReferralServerApi
             */
            'coupon' : function (couponCode){
                return renderUrl('referrals/', ['coupons', couponCode+'/']);
            },

            /**
             * @ngdoc function
             * @name .#referrer
             * @description Renders **`/api/referrals/:referrerCode`** Referrer URL
             * @param {string} referrerCode The referrer's code
             * @return {string} Rendered URL
             * @methodOf trulii.referrals.services.ReferralServerApi
             */
            'referrer' : function (referrerCode){
                return renderUrl('referrals/', [referrerCode+'/']);
            }
        };

        /**
         * @ngdoc function
         * @name .#renderUrl
         * @description URL Renderer, takes multiple parameters
         * @param {string} endpoint server endpoint, must start and end with '/'
         * @param {Array=} urlParams (Optional) Array with URL params. Are rendered in the same order they come
         * rendered through console output.
         * @return {string} Rendered URL
         * @methodOf trulii.referrals.services.ReferralServerApi
         */
        function renderUrl(endpoint, urlParams) {
            var hostArr = [serverApi, endpoint];
            var result = urlParams ? hostArr.concat(urlParams.join('/')) : hostArr;
            result = result.join('');
            if (debug) {
                console.log('ServerApi.renderUrl:');
                console.log(result);
            }
            return result;
        }

        return api;
    }

})();
