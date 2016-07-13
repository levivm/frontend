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
        var SESSIONS_PREFIX  = "sessions";
        var FORM_FIELD_ALL   = "__all__"; 

        //noinspection UnnecessaryLocalVariableJS
        var service = {
            FORM_FIELD_ALL: FORM_FIELD_ALL,
            form: {
                clear: clearErrors,
                add: addErrors,
                addArrayErrors:addArrayErrors,
                clearField:clearFieldError,
                resetForm:resetForm,
                addMultipleFormsErrors:addMultipleFormsErrors
            },
            session: {
                process: processSessionErrors
            }
        };

        return service;


        function clearFieldError(form,field){

            form[field].$setValidity(field, true);

        }

        function resetForm(form){
            clearErrors(form);

            for(var propertyName in form) {

                if (propertyName.indexOf('$') < 0 ){
                    form[propertyName].$setValidity(propertyName, true);
                }

            }


        }

        function clearErrors(form) {

            form.$setPristine();


            if (form.hasOwnProperty(FORM_FIELD_ALL))
                form[FORM_FIELD_ALL].$setValidity(FORM_FIELD_ALL, true);

        }

        function addMultipleFormsErrors(forms,responseErrors){
            _.each(responseErrors,function(error_dict,index){
                if (!(_.isEmpty(error_dict))){
                    var form = forms[index];

                    _.each(error_dict, function (message, field) {
                        form[field].error_message = message.pop();
                        form[field].$setValidity(field, false);
                    });

                }

            });

        }

        function addArrayErrors(form,responseErrors){
            _.each(responseErrors, function (error_dict) {
                console.log('responseErrors',error_dict);
                _.each(error_dict, function (message, field) {
                    console.log('message:',message);
                    form[field].error_message = message.pop();
                    form[field].$setValidity(field, false);
                });
            });

        }

        function addErrors(form, responseErrors) {
            //form.$valid = false;
            angular.forEach(responseErrors, function (fieldErrors, field) {
                var message = fieldErrors[0];

                // Error is unrelated to form fields
                if (field === NON_FIELD_ERRORS) return;
                // Process remaining form field errors
                if (field in form){
                    console.log(message, fieldErrors, field);                    
                    console.log(form[field]);                    
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
