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

        var service = {
            form: {
                clear: _clearErrors,
                add: _addError
            }
        };

        return service;

        function _clearErrors(form, errors) {
            form.$setPristine();
            errors = null;
            errors = {};
            return errors;
        }

        function _addError(form, formErrors, responseErrors) {
            //console.log('_addError:', 'form:', form, 'formErrors:', formErrors, 'responseErrors:', responseErrors);
            angular.forEach(responseErrors, function (errors, field) {
                var message = errors[0];
                //console.log('field:', field, 'message:', message);
                formErrors[field] = message;
                if (field in form)
                    form[field].$setValidity(message, false);
            });

            return formErrors;
        }
    }

})();