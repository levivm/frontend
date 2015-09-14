/**
 * @ngdoc service
 * @name trulii.payments.services.PaymentServerApi
 * @description API Service for Activity related Endpoints
 * @requires trulii.routes.serverConf
 */
(function () {
    'use strict';

    angular
        .module('trulii.payments.services')
        .factory('PaymentServerApi', PaymentServerApi);

    PaymentServerApi.$inject = ['serverConf'];

    function PaymentServerApi(serverConf) {

        var serverApi = serverConf.url + '/api/';
//        var apiVersion = 'v1';
        var debug = false;

        //noinspection UnnecessaryLocalVariableJS
        var api = {

            /**
             * @ngdoc function
             * @name trulii.payments.services.PaymentServerApi#payUInfo
             * @description Renders **`/api/payment/info`** PayU configuration data URL
             * @return {string} Rendered URL
             * @methodOf trulii.payments.services.PaymentServerApi
             */
            'payUInfo' : function (){
                return renderUrl('payment/', ['info']);
            },

            /**
             * @ngdoc function
             * @name trulii.payments.services.PaymentServerApi#bankListPSE
             * @description Renders **`/api/payment/pse/banks`** PayU available Banks for PSE transactions
             * @return {string} Rendered URL
             * @methodOf trulii.payments.services.PaymentServerApi
             */
            'PSEBankList' : function (){
                return renderUrl('payments/', ['pse','banks']);
            }
        };

        /**
         * @ngdoc function
         * @name trulii.payments.services.PaymentServerApi#renderUrl
         * @description URL Renderer, takes multiple parameters
         * @param {string} endpoint server endpoint, must start and end with '/'
         * @param {Array=} urlParams (Optional) Array with URL params. Are rendered in the same order they come
         * rendered through console output.
         * @return {string} Rendered URL
         * @methodOf trulii.payments.services.PaymentServerApi
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