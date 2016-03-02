/**
 * @ngdoc directive
 * @name trulii.search.directives.truliiSearchBar
 * @description truliiNavbar
 * @requires trulii.locations.services.LocationManager
 * @requires trulii.search.services.SearchManager
 */

(function () {
    'use strict';

    angular.module('trulii.search.directives')
        .directive('truliiSearchBar', truliiSearchBar);

    truliiSearchBar.$inject = ['$rootScope', '$state', '$stateParams', 'UIComponentsTemplatesPath', 'Toast',
        'SearchManager', 'LocationManager', 'Analytics'];

    function truliiSearchBar($rootScope, $state, $stateParams, UIComponentsTemplatesPath,
                          Toast, SearchManager, LocationManager, Analytics) {
        return {
            restrict: 'AE',
            templateUrl: UIComponentsTemplatesPath + "search-bar.html",
            link: function (scope, element, attrs) {

                var unsuscribeCityModified = null;
                var KEY_SEARCH_Q = SearchManager.KEY_QUERY;
                var KEY_SEARCH_CITY = SearchManager.KEY_CITY;

                angular.extend(scope, {
                    q : "",
                    search_city : null,
                    cities : [],
                    onNavbar : !!attrs.onNavbar,
                    updateSearchCity : updateSearchCity,
                    search : search,
                    getSuggestions:getSuggestions
                });

                _activate();

                //--------- Exposed Functions ---------//

                function search() {
                    /*if(!scope.search_city){
                        Toast.warning("Error", "Can't search without a city. Please specify a city to search on");
                        console.log("Error. Can't search without a city. Please specify a city to search on");
                        return;
                    }*/

                    console.log(_setCurrentCity());

                    var data = {};
                    console.log( );
                    data[KEY_SEARCH_Q] = scope.q;
                    data[KEY_SEARCH_CITY] =_setCurrentCity();

                    SearchManager.setSearchBarData(data);
                    angular.extend(data, SearchManager.getSearchData());
                    console.log('data', data);
                    Analytics.generalEvents.searchQuery(data[KEY_SEARCH_Q]);

                    $rootScope.$emit(SearchManager.EVENT_SEARCH_MODIFIED);
                    $state.go('search', data);
                }

                function getSuggestions(keyword){
                    return SearchManager.getSuggestions(keyword).then(success,error);

                    function success(response){
                        return response.data;
                    }

                    function error(response){
                        return [];
                    }
                }

                function updateSearchCity() {
                    LocationManager.setSearchCity(scope.search_city);
                }

                //--------- Internal Functions ---------//

                function _getCities() {
                    LocationManager.getAvailableCities().then(success, error);

                    function success(cities) {
                        scope.cities = cities;
                    }

                    function error() {
                        console.log("truliiSearchBar. Couldn't get cities");
                    }
                }

                function _setCurrentCity() {
                    var search_city = LocationManager.getSearchCity();
                    console.log(search_city);

                    if(!search_city){
                        search_city = LocationManager.getCurrentCity();
                    }
                    return search_city.id;
                }

                function _setStrings() {
                    if (!scope.strings) { scope.strings = {}; }
                    angular.extend(scope.strings, {
                        PLACEHOLDER_WANT_TO_LEARN: '¿Qué quieres aprender hoy?',
                        LABEL_CITY: 'Ciudad',
                        LABEL_CITY_DEFAULT: 'Ciudad..'
                    });
                }
                function _explore(){
                    scope.q="";
                    search();
                }

                function _cleanUp() {
                    unsuscribeCityModified();
                }

                function _activate() {
                    _setStrings();
                    _getCities();

                    if($stateParams.q){ scope.q = $stateParams.q; }

                    unsuscribeCityModified = $rootScope.$on(LocationManager.CURRENT_CITY_MODIFIED_EVENT, function(){
                        //_setCurrentCity();
                    });

                    scope.$on('$destroy', _cleanUp);
                    scope.$on(SearchManager.EVENT_EXPLORE, _explore);
                }
            }
        }
    }
})();
