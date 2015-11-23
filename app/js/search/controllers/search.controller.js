/**
 * @ngdoc controller
 * @name trulii.search.controllers.SearchController
 * @description Search view controller
 * @requires trulii.activities.services.ActivitiesManager
 */

(function () {
    'use strict';

    angular
        .module('trulii.search.controllers')
        .controller('SearchController', SearchController);

    SearchController.$inject = ['$rootScope', '$scope', '$q', '$location', '$timeout', '$state', '$stateParams', 'ActivitiesManager', 'LocationManager', 'SearchManager',
        'datepickerConfig', 'datepickerPopupConfig'];

    function SearchController($rootScope, $scope, $q, $location, $timeout, $state, $stateParams, ActivitiesManager, LocationManager, SearchManager,
          datepickerConfig, datepickerPopupConfig) {

        var FORMATS = ['dd-MM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        var unsuscribeSearchModified = null;
        var vm = this;
        angular.extend(vm, {
            activities : [],
            levels: [],
            costs : [],
            expandedCategory: null,
            searchData : {},
            searchQuery: null,
            searchCategory: null,
            searchSubCategory: null,
            searchLevel: null,
            searchDate: null,
            searchStartCost: 50000,
            searchEndCost: 250000,
            withCert: false,
            onWeekends: false,
            categories: [],
            format : FORMATS[0],
            minStartDate : new Date(),
            dateOptions : {
                formatYear: 'yy',
                startingDay: 1
            },
            opened: false,
            sliderOptions: {
                min: 30000,
                max: 1000000,
                step: 50000
            },
            getLevelClassStyle: getLevelClassStyle,
            openDatePicker: openDatePicker,
            expandCategory: expandCategory,
            setCategory: setCategory,
            setSubCategory: setSubCategory,
            setLevel: setLevel,
            setDate: setDate,
            updateCost: updateCost,
            setCertification: setCertification,
            setWeekends: setWeekends
        });

        _activate();

        //--------- Exposed Functions ---------//

        function openDatePicker($event){
            $event.preventDefault();
            $event.stopPropagation();

            vm.opened = true;
        }

        function expandCategory(category){
            vm.expandedCategory = vm.expandedCategory == category.id? null : category.id;
        }

        function setCategory(category, initializing){
            if(!category){ return; }

            if(vm.searchCategory === category.id){
                vm.searchCategory = null;
            } else {
                vm.searchCategory = category.id;
            }
            expandCategory(category);
            SearchManager.setCategory(vm.searchCategory);

            if(!initializing){
                vm.searchSubCategory = null;
                SearchManager.setSubCategory(vm.searchSubCategory);
                var data = SearchManager.getSearchData();
                var transitionOptions = {location: true, inherit: false};
                    $state.go('search', data, transitionOptions);
            }
        }

        function setSubCategory(subcategory){
            if(vm.searchSubCategory == subcategory.id){
                vm.searchSubCategory = null;
            } else {
                vm.searchSubCategory = subcategory.id;
                vm.searchCategory = subcategory.category;
            }

            //console.log('setSubCategory:', vm.searchSubCategory);
            SearchManager.setCategory(vm.searchCategory);
            SearchManager.setSubCategory(vm.searchSubCategory);
            $state.go('search', SearchManager.getSearchData());
        }

        function setLevel(){
            console.log('setLevel:', vm.searchLevel);
            SearchManager.setLevel(vm.searchLevel.code);
        }

        function setDate(){
            console.log('setDate:', vm.searchDate.getTime());
            SearchManager.setDate(vm.searchDate.getTime());
        }

        function updateCost(costStart, costEnd){
            SearchManager.setCosts(costStart, costEnd);
        }

        function setCertification(){
            vm.withCert = !vm.withCert;
            console.log('setCert:', vm.withCert);
            SearchManager.setCertification(vm.withCert);
        }

        function setWeekends(){
            vm.onWeekends = !vm.onWeekends;
            console.log('setWeekends:', vm.onWeekends);
            SearchManager.setWeekends(vm.onWeekends);
        }

        function getLevelClassStyle(level) {
            return {
                'btn-active' : vm.searchLevel? vm.searchLevel.code === level.code : false
            };
        }

        //--------- Internal Functions ---------//

        function _getActivities(data){
            SearchManager.searchActivities(data).then(success, error);

            function success(response){
                vm.activities = response.activities;
                console.log('activities from ActivitiesManager:', vm.activities);
            }
            function error(response){
                console.log('getActivities. Error obtaining Activities from ActivitiesManager');
            }
        }

        function _getSearchParams(){
            var deferred = $q.defer();
            vm.searchData = SearchManager.getSearchData($stateParams);
            vm.searchQuery = vm.searchData[SearchManager.KEY_QUERY];
            var sm = SearchManager;

            if($stateParams.city){
                var city = LocationManager.getCityById(parseInt($stateParams.city));
                LocationManager.setSearchCity(city);
            }

            if(vm.searchData.hasOwnProperty(sm.KEY_DATE)){ vm.searchDate = new Date(vm.searchData[sm.KEY_DATE]); }
            if(vm.searchData.hasOwnProperty(sm.KEY_LEVEL)){ vm.searchlevel = vm.searchData[sm.KEY_LEVEL]; }

            if(vm.searchData.hasOwnProperty(sm.KEY_COST_START)){ vm.searchStartCost = vm.searchData[sm.KEY_COST_START]; }
            if(vm.searchData.hasOwnProperty(sm.KEY_COST_END)){ vm.searchEndCost = vm.searchData[sm.KEY_COST_END]; }

            if(vm.searchData.hasOwnProperty(sm.KEY_CERTIFICATION) && vm.searchData[sm.KEY_CERTIFICATION]){
                vm.withCert = vm.searchData[sm.KEY_CERTIFICATION];
            }
            if(vm.searchData.hasOwnProperty(sm.KEY_WEEKENDS) && vm.searchData[sm.KEY_WEEKENDS]){
                vm.onWeekends = vm.searchData[sm.KEY_WEEKENDS];
            }

            if(vm.searchData.hasOwnProperty(sm.KEY_CATEGORY)){
                var category = vm.categories.filter(categoryFilter)[0];
                if(category){
                    setCategory(category, true);
                    if(category){
                        vm.searchData["category_display"] = category.name;
                        if(vm.searchData.hasOwnProperty(sm.KEY_SUBCATEGORY)){
                            var subcategory = category.subcategories.filter(subCategoryFilter)[0];
                            vm.searchSubCategory = vm.searchData[sm.KEY_SUBCATEGORY];
                            SearchManager.setSubCategory(vm.searchSubCategory);
                            if(subcategory){ vm.searchData["subcategory_display"] = subcategory.name; }
                        }
                    }
                }
            }

            deferred.resolve();

            return deferred.promise;

            function categoryFilter(category){ return category.id === vm.searchData[sm.KEY_CATEGORY]; }
            function subCategoryFilter(subcategory){ return subcategory.id === vm.searchData[sm.KEY_SUBCATEGORY]; }
        }

        function _getGeneralInfo(){
            var deferred = $q.defer();
            ActivitiesManager.loadGeneralInfo().then(successInfo, errorInfo);
            return deferred.promise;

            function successInfo(response){
                vm.levels = response.levels;
                vm.categories = response.categories;
                deferred.resolve();
            }

            function errorInfo(response){
                console.log('Error getting GeneralInfo.', response.data);
                deferred.reject();
            }
        }

        function _setWatches(){
            $rootScope.$watch(watchStartCost , function(newValue){
                SearchManager.setCosts(newValue, vm.searchEndCost);
            });

            $rootScope.$watch(watchEndCost, function(newValue){
                SearchManager.setCosts(vm.searchStartCost, newValue);
            });

            function watchStartCost(){
                return vm.searchStartCost;
            }

            function watchEndCost(){
                return vm.searchEndCost;
            }
        }

        function _setStrings(){
            if(!vm.strings){ vm.strings = {}; }
            angular.extend(vm.strings, {
                ACTION_CLOSE: "Cerrar",
                COPY_RESULTS_FOR: "resultados para ",
                COPY_IN: "en",
                OPTION_SELECT_LEVEL: "-- Nivel --",
                PLACEHOLDER_DATE: "A Partir de",
                COPY_INTERESTS: "¿Qué tema te interesa?",
                LABEL_LEVEL: "Nivel",
                LABEL_COST: "Precio",
                LABEL_DATE: "Fecha",
                LABEL_WITH_CERTIFICATE: "Con Certificado",
                LABEL_WEEKENDS: "Fines de Semana",
                LABEL_EMPTY_SEARCH:"Houston, tenemos un problema.",
                COPY_EMPTY_SEARCH: "Puede que no tengamos lo que estés buscando."
                    + " Por si acaso, te recomendamos intentarlo de nuevo."
            });
        }

        function _cleanUp() {
            unsuscribeSearchModified();
        }

        function _activate(){
            datepickerPopupConfig.showButtonBar = false;
            datepickerConfig.showWeeks = false;
            _setWatches();

            _setStrings();
            _getGeneralInfo().then(function(){
                _getSearchParams();
            });

            _getActivities($stateParams);

            unsuscribeSearchModified = $rootScope.$on(SearchManager.EVENT_SEARCH_MODIFIED
                , function (event) {
                    console.log('searchBar. on' + SearchManager.EVENT_SEARCH_MODIFIED);
                    _getSearchParams().then(function(){
                        _getActivities($stateParams);
                    });
                }
            );

            $scope.$on('$destroy', _cleanUp);

        }
    }
})();
