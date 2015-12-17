/**
 * @ngdoc filter
 * @name trulii.utils.filters.formatDuration
 * @restrict E
 * @description Trulii Activity Item Directive.
 * @param {object} activity Activity instance to represent
 * @param {object} options Options object
 * @param {array} options.actions Action buttons to display
 * @param {boolean} options.disabled Defines if the activity should have an opacity overlay
 */

(function () {
  'use strict';

  angular
    .module('trulii.utils.filters')

    .filter('formatDuration',formatDuration);

    formatDuration.$inject = [];
    function formatDuration(){

        var strings = {};
            angular.extend(strings,{
                COPY_NULL_VALUE: "No Especificado"
            });

        return applyFormat;

        function applyFormat(duration,time_unit){
            if (angular.isUndefined(duration)) {
                return strings.COPY_NULL_VALUE;
            }

            var _duration = moment.duration(duration,time_unit);
            var hours   = _duration.hours();
            var minutes = _duration.minutes();

            return hours +"h "+minutes+"m";
        }
    }
})();
