/**
 * @ngdoc service
 * @name trulii.utils.services.defaultCover
 * @description Default Picture URL
 */

(function () {
    'use strict';

    angular
        .module('trulii.utils.services')
        .value("defaultCover", noCover);
        
        noCover.$inject = ['serverConf'];
        function noCover(serverConf){
          return serverConf.s3URL + '/static/img/nocover.jpg';
        }

})();