
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

    	function applyFormat(duration,time_unit){
            if (angular.isUndefined(duration))
                return strings.COPY_NULL_VALUE;

            var _duration = moment.duration(duration,time_unit);
            var hours   = _duration.hours();
            var minutes = _duration.minutes();
            return hours +"h "+minutes+"m";
    	}

        return applyFormat;

    }

})();