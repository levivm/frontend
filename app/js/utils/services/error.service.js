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
                add: _addErrors
            }
        };

        return service;

        function _clearErrors(form, errors) {
            form.$setPristine();
            errors = null;
            errors = {};
            return errors;
        }

        function _addErrors(form, formErrors, responseErrors) {
            angular.forEach(responseErrors, function (errors, field) {
                var message = errors[0];
                formErrors[field] = message;
                if (field in form)
                    form[field].error_message = message;
                    form[field].$setValidity(field, false);
            });

            return formErrors;
        }
    }

})();