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
                clear: clearErrors,
                add: addErrors
            },
            session: {
                process: processSessionErrors
            }
        };

        return service;

        function clearErrors(form) {
            form.$setPristine();
            
            // form.$valid = true;
        }

        function addArrayErrors(form,responseErrors){


            // angular.forEach(responseErrors, function (fieldErrors, field) {
            //     var message = fieldErrors[0];

            //     // Error is unrelated to form fields
            //     if (field === NON_FIELD_ERRORS) return;

            //     // Process remaining form field errors
            //     if (field in form){
            //         form[field].error_message = message;
            //         form[field].$setValidity(field, false);
            //     }

            // });

        }

        function addErrors(form, responseErrors) {
            
            // form.$valid = false;
            angular.forEach(responseErrors, function (fieldErrors, field) {

                if (_.isArray(fieldErrors)){


                    _.each(fieldErrors, function (error_dict) {

                        _.each(error_dict, function (message, field) {
                            console.log("message,field",message,field);
                            form[field].error_message = message.pop();
                            form[field].$setValidity(field, false);
                        });
                    });
                    return

                }

                var message = fieldErrors[0];

                // Error is unrelated to form fields
                if (field === NON_FIELD_ERRORS) return;

                // Process remaining form field errors
                if (field in form){
                    form[field].error_message = message;
                    form[field].$setValidity(field, false);
                }

            });

        }

        function processSessionErrors(form, responseErrors){
            angular.forEach(responseErrors, function (fieldErrors, field) {
                var message = fieldErrors[0];
                var isSessionError = field.split("_")[0] == SESSIONS_PREFIX;
                if(isSessionError){
                    fieldErrors.session_error = isSessionError ? message : null;
                }
            });
        }
    }

})();