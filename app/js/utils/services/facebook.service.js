/**
 * @ngdoc service
 * @name trulii.utils.services.Facebook
 * @description Facebook API Service
 * @requires ng.$http
 */


(function () {
    'use strict';

    angular
        .module('trulii.utils.services')
        .factory('FacebookAPI', FacebookAPI);

    FacebookAPI.$inject = ['$http', '$state'];

    function FacebookAPI($http, $state) {

        var api = 'http://api.facebook.com/restserver.php';

        var service  = {
            getShares: getShares
        };

        return service;

        function getShares() {

            var url = $state.href($state.current.name, $state.params, {absolute: true});

            var params = {
                method: 'links.getStats',
                urls: url,
                format: 'json'
            };
            
            return $http.get('https://graph.facebook.com/' + url)
                .then(function (response) {
                    return response.data.share_count;
                });
        }

    };

})();

