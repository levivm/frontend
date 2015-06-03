/**
 * @ngdoc service
 * @name trulii.ui-components.services.Toast
 * @description Angular Service Wrapper for Toast library {@link https://github.com/CodeSeven/toastr}
 */

(function () {
    'use strict';

    angular
        .module('trulii.ui-components.services')
        .factory('Toast', Toast);

    Toast.$inject = [];

    function Toast() {

        _initialize();

        //noinspection UnnecessaryLocalVariableJS
        var Toast = {

            /**
             * @ngdoc function
             * @name trulii.ui-components.services.Toast#info
             * @description Display a info toast
             * @param {string} title Title of the Toast to display
             * @param {string=} message Message of the Toast to display
             * @methodOf trulii.ui-components.services.Toast
             */
            info : toastr.info,

            /**
             * @ngdoc function
             * @name trulii.ui-components.services.Toast#success
             * @description Display a success toast
             * @param {string} title Title of the Toast to display
             * @param {string=} message Message of the Toast to display
             * @methodOf trulii.ui-components.services.Toast
             */
            success : toastr.success,

            /**
             * @ngdoc function
             * @name trulii.ui-components.services.Toast#error
             * @description Display a error toast
             * @param {string} title Title of the Toast to display
             * @param {string=} message Message of the Toast to display
             * @methodOf trulii.ui-components.services.Toast
             */
            error : toastr.error,

            /**
             * @ngdoc function
             * @name trulii.ui-components.services.Toast#warning
             * @description Display a warning toast
             * @param {string} title Title of the Toast to display
             * @param {string=} message Message of the Toast to display
             * @methodOf trulii.ui-components.services.Toast
             */
            warning : toastr.warning,

            /**
             * @ngdoc property
             * @name trulii.ui-components.services.Toast#generics
             * @description Generics object for custom toast wrappers
             * @propertyOf trulii.ui-components.services.Toast
             */
            generics : {

                /**
                 * @ngdoc function
                 * @name trulii.ui-components.services.Toast.generics#weSave
                 * @description Info toast wrapper for **"save"** events. contained
                 * in **generics** service property
                 * @param {string} complement Save event message to display
                 * @methodOf trulii.ui-components.services.Toast
                 */
                weSave : weSave
            },

            /**
             * @ngdoc function
             * @name trulii.ui-components.services.Toast#setPosition
             * @description Set Toasts position
             * @param {string} classPos position class
             * @methodOf trulii.ui-components.services.Toast
             */
            setPosition : setPosition
        };

        return Toast;

        //////////////

        function weSave(complement) {
            toastr.info(complement, "¡Información guardada!");   // TODO: From translate
        }

        function setPosition(classPos) {
            toastr.options = {
                "positionClass" : classPos
            }

        }

        function _initialize() {
            // var progressBar = progressBar ? progressBar : true;
            // var timeOut = timeout ? timeout : "3500";
            // var positionClass = positionClass ? positionClass : "toast-bottom-right";
            toastr.options = {
                "progressBar" : true,
                "timeOut" : "3500",
                "positionClass" : "toast-bottom-right"
            }
        }

    }

})();