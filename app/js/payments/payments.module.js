/**
 * @ngdoc object
 * @name trulii.payments
 * @description Trulii Payments Module
 */

(function () {
    'use strict';

    angular
        .module('trulii.payments', [
            'trulii.payments.services'
        ])
        .config(config);

    angular
        .module('trulii.payments.services', []);

    //noinspection JSValidateJSDoc
    /**
     * @ngdoc object
     * @name trulii.payments.config
     * @description Payments Module Config function
     * @requires ui.router.state.$stateProvider
     */
    config.$inject = ['$stateProvider'];
    function config($stateProvider) {
        $stateProvider
            .state('payment-pse-response', {
                url:'/payments/pse/response',
                onEnter: pseResponseProccessing
            });

        /**
         * @ngdoc method
         * @name .#pseResponseProccessing
         * @description Proccess PSE payment url response. If payment is successful, user would be redirect to
         * success enroll or payment declined state
         * @requires ui.router.state.$stateParams
         * @requires trulii.authentication.services.Authentication
         * @methodOf trulii.payments.config
         */
        pseResponseProccessing.$inject = ['$location', '$state', 'Payments'];
        function pseResponseProccessing($location, $state, Payments){
            console.log("stateParams",$state);
            console.log("stateParams",$state.params);
            console.log("stateParams",$location.search());

            // #state_pol response_code_pol
            // #     4            1           Transacción aprobada
            // #     6            5           Transacción fallida
            // #     6            4           Transacción rechazada
            // #     12          9994         Transacción pendiente, por favor revisar si el \
            // #                                       débito fue realizado en el banco.

            var parameters = $location.search();

            var pol_transaction_state = parameters.polTransactionState;
            var pol_response_code  = parameters.polResponseCode;

            var reference_data = parameters.referenceCode.split("-");
            var calendar_id  = parseInt(reference_data.pop());
            var activity_id = parseInt(reference_data.pop());
            var package_quantity = parseInt(reference_data.pop());
            var package_id = parseInt(reference_data.pop());
            var package_type = reference_data.pop();
            console.log("PACHAGE ASDASDASDASD", package_type)
            var state;

            if (pol_transaction_state == Payments.KEY_PSE_STATE_POL_CODE_4 &&
               pol_response_code == Payments.KEY_PSE_RESPONSE_CODE_POL_1){
                state = Payments.KEY_PSE_APPROVED_PAYMENT;
            }
            else if (pol_transaction_state == Payments.KEY_PSE_STATE_POL_CODE_6 &&
                     pol_response_code == Payments.KEY_PSE_RESPONSE_CODE_POL_5){

                state = Payments.KEY_PSE_FAILED_PAYMENT;

            }
            else if (pol_transaction_state == Payments.KEY_PSE_STATE_POL_CODE_6 &&
                     pol_response_code == Payments.KEY_PSE_RESPONSE_CODE_POL_4){

                state = Payments.KEY_PSE_REJECTED_PAYMENT;

            }
            else if (pol_transaction_state == Payments.KEY_PSE_STATE_POL_CODE_12 &&
                     pol_response_code == Payments.KEY_PSE_RESPONSE_CODE_POL_9994){
                state = Payments.KEY_PSE_PENDING_PAYMENT;
            }

            var state_params = {
                activity_id: activity_id,
                calendar_id: calendar_id,
                package_quantity: package_quantity ? package_quantity : null,
                package_id: package_id ? package_id : null,
                package_type: package_type ? package_type : null,
                state: state
            };

            var params = _.merge(state_params,parameters);

            $state.go('activities-enroll.pse-response',params);
        }
    }

})();
