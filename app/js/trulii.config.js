/**
 * @ngdoc function
 * @name trulii.config.config
 * @description Trulii config module
 * @requires ng.$locationProvider
 * @requires $httpProvider
 */

(function () {
    'use strict';

    angular
        .module('trulii.config')
        .config(config)
        .run(run);


    config.$inject = ['$locationProvider','$httpProvider'];

    function config($locationProvider, $httpProvider) {

        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');

        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

        // Use x-www-form-urlencoded Content-Type
        //$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

        /**
         * @ngdoc method
         * @name trulii.config.config#param
         * @description The workhorse; converts an object to x-www-form-urlencoded serialization.
         * @param {Object} obj Object to encode
         * @return {string} Rendered QueryString
         * @methodOf trulii.config.config
         */
        var param = function(obj) {
            var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

            for(name in obj) {
                value = obj[name];

                if(value instanceof Array) {
                    for(i=0; i<value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[]';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                }
                else if(value instanceof Object) {
                    for(subName in value) {
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                }
                else if(value !== undefined && value !== null)
                    query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
            }

            return query.length ? query.substr(0, query.length - 1) : query;
        };

        $httpProvider.interceptors.push('sessionInjector');

        //Override $http service's default transformRequest
        // $httpProvider.defaults.transformRequest = [function(data) {
        //   return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
        // }];

    }

    run.$inject = ['$rootScope'];

    function run($rootScope){

        $rootScope.$on('$stateChangeStart', 
          function(event, toState, toParams, fromState, fromParams){
            console.log("Inicia  el cambio de estado");
            console.log(toState);
        });
    }

     
})();