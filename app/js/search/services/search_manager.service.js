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
        var EVENT_SEARCH_MODIFIED = "truliiSearchModified";

        var api = ActivityServerApi;
        var searchData = {};

        //noinspection UnnecessaryLocalVariableJS
        var service = {

            /**
             * @ngdoc method
             * @name .#searchActivities
             * @description Returns `searchData`. Also accepts an optional data object to extend or update current
             * search query data
             * @param {object=} data External Query Data
             * @return {object} searchData Current Search Query Data
             * @methodOf trulii.search.services.SearchManager
             */
            getSearchData: getSearchData,

            /**
             * @ngdoc method
             * @name .#searchActivities
             * @description Used to set search Query Data from searchBar
             * @param {object} data External Query Data
             * @param {string} q User search String
             * @param {number} city ID of the city to search from
             * @return {object} searchData Current Search Query Data
             * @methodOf trulii.search.services.SearchManager
             */
            setSearchBarData: setSearchBarData,

            /**
             * @ngdoc method
             * @name .#searchActivities
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

            /**
             * @ngdoc method
             * @name .#searchActivities
             * @description Clears the current search query data
             * @param {object=} data External Query Data
             * @return {object} searchData Current Search Query Data
             * @methodOf trulii.search.services.SearchManager
             */
            clearData: clearData,

            setCategory: setCategory,
            setSubCategory: setSubCategory,
            setDate: setDate,
            setLevel: setLevel,
            setCosts: setCosts,
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
            KEY_WEEKENDS : KEY_WEEKENDS,
            EVENT_SEARCH_MODIFIED: EVENT_SEARCH_MODIFIED
        };

        return service;

        function getSearchData(data){
            if(data){ setSearchData(data); }

            if(!searchData[KEY_WEEKENDS]){ delete searchData[KEY_WEEKENDS];}

            return searchData;
        }

        function searchActivities(data){
            var deferred = $q.defer();
            var requestConfig;

            setSearchData(data);

            if(!searchData.hasOwnProperty(KEY_CITY)){ deferred.reject(null); }

            requestConfig = { 'params': searchData };
            $http.get(api.search(), requestConfig).then(success, error);

            return deferred.promise;

            function success(response){
                console.log(response.data);
                var stateParams = {};
                angular.extend(stateParams, searchData);
                stateParams.activities = response.data;
                deferred.resolve(stateParams);
            }
            function error(response){ deferred.reject(response); }
        }

        function clearData(){
            console.log('clearing Data');
            searchData = {};
        }

        function setSearchBarData(data){

            if(data.hasOwnProperty(KEY_CITY) && data[KEY_CITY]){ searchData[KEY_CITY] = parseInt(data[KEY_CITY]); }

            if(data.hasOwnProperty(KEY_QUERY) && data[KEY_QUERY]){
                searchData[KEY_QUERY] = data[KEY_QUERY];
            } else {
                delete searchData[KEY_QUERY];
            }

            return searchData;
        }

        function setSearchData(data){

            setSearchBarData(data);

            if(data.hasOwnProperty(KEY_CATEGORY) && data[KEY_CATEGORY]){
                searchData[KEY_CATEGORY] = parseInt(data[KEY_CATEGORY]);
            } else {
                delete searchData[KEY_CATEGORY];
            }

            if(data.hasOwnProperty(KEY_SUBCATEGORY) && data[KEY_SUBCATEGORY]){
                searchData[KEY_SUBCATEGORY] = parseInt(data[KEY_SUBCATEGORY]);
            } else {
                delete searchData[KEY_SUBCATEGORY];
            }

            if(data.hasOwnProperty(KEY_DATE) && data[KEY_DATE]){
                searchData[KEY_DATE] = parseInt(data[KEY_DATE]);
            } else {
                delete searchData[KEY_DATE];
            }

            if(data.hasOwnProperty(KEY_LEVEL) && data[KEY_LEVEL]){
                searchData[KEY_LEVEL] = data[KEY_LEVEL];
            } else {
                delete searchData[KEY_LEVEL];
            }

            if(data.hasOwnProperty(KEY_COST_START) && data[KEY_COST_START]){
                searchData[KEY_COST_START] = parseInt(data[KEY_COST_START]);
            } else {
                delete searchData[KEY_COST_START];
            }

            if(data.hasOwnProperty(KEY_COST_END) && data[KEY_COST_END]){
                searchData[KEY_COST_END] = parseInt(data[KEY_COST_END]);
            } else {
                delete searchData[KEY_COST_END];
            }

            if(data.hasOwnProperty(KEY_CERTIFICATION) && (data[KEY_CERTIFICATION] == 'true')){
                searchData[KEY_CERTIFICATION] = (data[KEY_CERTIFICATION] == 'true');
            } else {
                delete searchData[KEY_CERTIFICATION];
            }

            if(data.hasOwnProperty(KEY_WEEKENDS) && (data[KEY_WEEKENDS] == 'true')){
                searchData[KEY_WEEKENDS] = (data[KEY_WEEKENDS] == 'true');
            } else {
                delete searchData[KEY_WEEKENDS];
            }

            return searchData;
        }

        function setCategory(category){
            if(category){
                searchData[KEY_CATEGORY] = category;
            } else {
                delete searchData[KEY_CATEGORY];
            }
        }

        function setSubCategory(subcategory){
            if(subcategory){
                searchData[KEY_SUBCATEGORY] = subcategory;
            } else {
                delete searchData[KEY_SUBCATEGORY];
            }
        }

        function setDate(date){
            searchData[KEY_DATE] = date;
        }

        function setLevel(level){
            searchData[KEY_LEVEL] = level;
        }

        function setCosts(start, end){
            searchData[KEY_COST_START] = start;
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
