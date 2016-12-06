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
                var KEY_ORDER = SearchManager.KEY_ORDER;
                var KEY_COST_START = SearchManager.KEY_COST_START;
                var KEY_COST_END = SearchManager.KEY_COST_END;

                angular.extend(scope, {
                    q : "",
                    search_city : null,
                    cities : [],
                    onNavbar : !!attrs.onNavbar,
                    onSearchpage: !!attrs.onSearchpage,
                    onFocusbar: !!attrs.onFocusbar,
                    updateSearchCity : updateSearchCity,
                    searchBar: searchBar,
                    getSuggestions:getSuggestions,
                    onFocus:onFocus,
                    onFocusInput: false
                });

                _activate();

                // //--------- Exposed Functions ---------//

                function searchBar() {
                    /*if(!scope.search_city){
                        Toast.warning("Error", "Can't search without a city. Please specify a city to search on");
                        console.log("Error. Can't search without a city. Please specify a city to search on");
                        return;
                    }*/

                    var data = {};
                    data[KEY_SEARCH_Q] = scope.q;

                    data[KEY_SEARCH_CITY] = scope.search_city.id;

                    data[KEY_ORDER] = 'closest';
                    data[KEY_COST_START] = 50000;
                    data[KEY_COST_END] = 250000;

                    SearchManager.setCity(data[KEY_SEARCH_CITY]);
                    SearchManager.setQuery(data[KEY_SEARCH_Q]);
                    SearchManager.setOrder('closest');
                    SearchManager.setCosts(50000, 250000);

                    Analytics.generalEvents.searchQuery(data[KEY_SEARCH_Q]);

                    if ($state.current.name === 'search'){
                      $rootScope.$emit(SearchManager.EVENT_SEARCH_MODIFIED);
                    }
                    else{
                       scope.q = '';
                       $state.go('search', data);
                    }
                      

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
                    LocationManager.setCurrentCity(scope.search_city);
                }
                
                function onFocus(){
                    scope.onFocusInput = scope.onFocusbar ? !scope.onFocusInput: false;
                }

                // //--------- Internal Functions ---------//

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
                    scope.search_city = LocationManager.getSearchCity();
                    if(!scope.search_city){
                        scope.search_city = LocationManager.getCurrentCity();
                    }
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

                function _getQuery(){
                    scope.q = SearchManager.getQuery();
                }

                function _cleanUp() {
                    unsuscribeCityModified();
                }

                function _activate() {
                    _setStrings();
                    _setCurrentCity();
                    _getCities();
                    _getQuery();

                    if($stateParams.q){ scope.q = $stateParams.q; }

                    unsuscribeCityModified = $rootScope.$on(LocationManager.CURRENT_CITY_MODIFIED_EVENT, function(){
                        _setCurrentCity();
                    });
                    
                    scope.$watch('q', function ( newValue, oldValue ) {
                          SearchManager.setQueryChange(newValue);
                        }
                    );


                    scope.$on('$destroy', _cleanUp);
                    scope.$on(SearchManager.EVENT_EXPLORE, _explore);
                    $rootScope.$on(SearchManager.EVENT_QUERY_MODIFIED, function(){
                         _getQuery();
                    })
                    
                }
            }
        }
    }
})();