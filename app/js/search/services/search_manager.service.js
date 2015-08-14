/**
 * @ngdoc service
 * @name trulii.search.services.SearchManager
 * @description Search Manager Service
 * @requires ng.$http
 * @requires ng.$q
 */
(function () {
    'use strict';

    angular
        .module('trulii.search.services')
        .factory('SearchManager', SearchManager);

    SearchManager.$inject = ['$http', '$q', 'ActivityServerApi'];

    function SearchManager($http, $q, ActivityServerApi) {

        var KEY_QUERY = 'q';
        var KEY_CITY = 'city';
        var KEY_CATEGORY = 'category';
        var KEY_SUBCATEGORY = 'subcategory';
        var KEY_DATE = 'date';
        var KEY_LEVEL = 'level';
        var KEY_COST_START = 'cost_start';
        var KEY_COST_END = 'cost_end';
        var KEY_CERTIFICATION = 'certification';
        var KEY_WEEKENDS = 'weekends';
        var api = ActivityServerApi;
        var searchData = {};

        //noinspection UnnecessaryLocalVariableJS
        var service = {

            getSearchData: function(){ return searchData; },

            /**
             * @ngdoc method
             * @name trulii.search.services.SearchManager#searchActivities
             * @description Searches activities with provided search parameters
             * @param {string} data Query Data
             * @param {string=} data.q query string
             * @param {number} data.cityId Id of the city where to search for activities
             * @param {number=} data.categoryId Id of the category where to search for activities
             * @param {number=} data.subcategoryId Id of the subcategory where to search for activities
             * @param {number=} data.date Date in Unix Timestamp format from where to search for activities
             * @return {promise} Activities Promise
             * @methodOf trulii.search.services.SearchManager
             */
            searchActivities: searchActivities,

            clearData: clearData,
            setCategory: setCategory,
            setSubCategory: setSubCategory,
            setDate: setDate,
            setLevel: setLevel,
            setCostStart: setCostStart,
            setCostEnd: setCostEnd,
            setCertification: setCertification,
            setWeekends: setWeekends,

            KEY_QUERY : KEY_QUERY,
            KEY_CITY : KEY_CITY,
            KEY_CATEGORY : KEY_CATEGORY,
            KEY_SUBCATEGORY : KEY_SUBCATEGORY,
            KEY_DATE : KEY_DATE,
            KEY_LEVEL: KEY_LEVEL,
            KEY_COST_START : KEY_COST_START,
            KEY_COST_END : KEY_COST_END,
            KEY_CERTIFICATION : KEY_CERTIFICATION,
            KEY_WEEKENDS : KEY_WEEKENDS
        };

        return service;

        function searchActivities(data){
            var deferred = $q.defer();
            var requestConfig;

            if(data.hasOwnProperty(KEY_QUERY)){ searchData[KEY_QUERY] = data[KEY_QUERY]; }
            if(data.hasOwnProperty(KEY_CITY)){ searchData[KEY_CITY] = data[KEY_CITY]; }
            if(data.hasOwnProperty(KEY_CATEGORY)){ searchData[KEY_CATEGORY] = data[KEY_CATEGORY]; }
            if(data.hasOwnProperty(KEY_SUBCATEGORY)){ searchData[KEY_SUBCATEGORY] = data[KEY_SUBCATEGORY]; }
            if(data.hasOwnProperty(KEY_DATE)){ searchData[KEY_DATE] = data[KEY_DATE]; }

            console.log('searchData:', searchData);

            if(!searchData.hasOwnProperty(KEY_CITY)){
                deferred.reject(null);
            }

            requestConfig = {
                'params': searchData
            };

            $http.get(api.search(), requestConfig).then(success, error);

            return deferred.promise;

            function success(response){
                console.log(response.data);
                deferred.resolve(response.data);
            }
            function error(response){
                deferred.reject(response);
            }
        }

        function clearData(){
            console.log('clearing Data');
            searchData = {};
        }

        function setCategory(category){
            searchData[KEY_CATEGORY] = category;
        }

        function setSubCategory(subcategory){
            searchData[KEY_SUBCATEGORY] = subcategory;
        }

        function setDate(date){
            searchData[KEY_DATE] = date;
        }

        function setLevel(level){
            searchData[KEY_LEVEL] = level;
        }

        function setCostStart(start){
            searchData[KEY_COST_START] = start;
        }

        function setCostEnd(end){
            searchData[KEY_COST_END] = end;
        }

        function setCertification(withCertification){
            searchData[KEY_CERTIFICATION] = withCertification;
        }

        function setWeekends(withWeekends){
            searchData[KEY_WEEKENDS] = withWeekends;
        }
    }

})();