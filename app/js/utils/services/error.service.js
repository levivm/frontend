/**
 * @ngdoc service
 * @name trulii.utils.services.Error
 * @description Error Handling Service
 */

(function () {
    'use strict';

    angular
        .module('trulii.utils.services')
        .factory('Error', Error);

    Error.$inject = [];

    function Error() {

        /**
         * @ngdoc property
         * @name trulii.utils.services.Error#NON_FIELD_ERRORS
         * @description Non field errors constant value
         * @propertyOf trulii.utils.services.Error
         */
        var NON_FIELD_ERRORS = "non_field_errors";
        var SESSIONS_PREFIX = "sessions";

        //noinspection UnnecessaryLocalVariableJS
        var service = {
            form: {
                clear: _clearErrors,
                add: _addErrors
            }
        };

        return service;

        function _clearErrors(form) {
            form.$setPristine();
        }

        function _addErrors(form, responseErrors) {
            angular.forEach(responseErrors, function (fieldErrors, field) {
                var message = fieldErrors[0];

                // Error is unrelated to form fields
                if (field === NON_FIELD_ERRORS) return;

                // Check and treat session related errors
                processSessionError(field, message);

                // Process remaining form field errors
                if (field in form){
                    form[field].error_message = message;
                    form[field].$setValidity(field, false);
                }
            });
        }

        function processSessionError(field, message, fieldErrors){
            var isSessionError = field.split("_")[0] == SESSIONS_PREFIX;
            if(isSessionError){
                fieldErrors.session_error = isSessionError ? message : null;
            }
        }
    }

})();