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

    truliiSearchBar.$inject = ['$rootScope', '$state', '$stateParams', 'UIComponentsTemplatesPath',
        'SearchManager', 'LocationManager'];

    function truliiSearchBar($rootScope, $state, $stateParams, UIComponentsTemplatesPath,
                          SearchManager, LocationManager) {
        return {
            restrict: 'AE',
            templateUrl: UIComponentsTemplatesPath + "search-bar.html",
            link: function (scope, element, attrs) {

                var unsuscribeCityModified = null;
                var KEY_SEARCH_Q = SearchManager.KEY_QUERY;
                var KEY_SEARCH_CITY = SearchManager.KEY_CITY;

                scope.q = null;
                scope.search_city = null;
                scope.cities = [];
                scope.updateSearchCity = updateSearchCity;
                scope.search = search;

                _activate();

                //--------- Exposed Functions ---------//

                function search() {
                    var data = {};
                    data[KEY_SEARCH_Q] = scope.q;
                    data[KEY_SEARCH_CITY] = scope.search_city.id;

                    if(!scope.search_city){
                        console.log("Error. Can't search without a city. Please specify a city to search on");
                        return;
                    }
                    SearchManager.setSearchBarData(data);
                    angular.extend(data, SearchManager.getSearchData());
                    console.log('data', data);

                    $rootScope.$emit(SearchManager.EVENT_SEARCH_MODIFIED);
                    $state.go('search', data);
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
                    scope.search_city = LocationManager.getCurrentCity();
                }

                function _setStrings() {
                    if (!scope.strings) {
                        scope.strings = {};
                    }

                    angular.extend(scope.strings, {
                        PLACEHOLDER_WANT_TO_LEARN: '¿Qué quieres aprender hoy?',
                        LABEL_CITY: 'Ciudad',
                        LABEL_CITY_DEFAULT: 'Ciudad..'
                    });
                }

                function _cleanUp() {
                    unsuscribeCityModified();
                }

                function _activate() {
                    _setStrings();
                    _setCurrentCity();
                    _getCities();

                    if($stateParams.q){ scope.q = $stateParams.q; }

                    unsuscribeCityModified = $rootScope.$on(LocationManager.CURRENT_CITY_MODIFIED_EVENT
                        , function (event) {
                            _setCurrentCity();
                        }
                    );

                    scope.$on('$destroy', _cleanUp);
                }
            }
        }
    }

})();
