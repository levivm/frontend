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

    SearchController.$inject = ['$rootScope', '$scope', '$q', '$location', '$anchorScroll', '$state'
            , '$stateParams', 'generalInfo', 'ActivitiesManager', 'LocationManager', 'SearchManager'
            , 'datepickerConfig', 'datepickerPopupConfig'];

    function SearchController($rootScope, $scope, $q, $location, $anchorScroll, $state, $stateParams
            , generalInfo, ActivitiesManager, LocationManager, SearchManager
            , datepickerConfig, datepickerPopupConfig) {

        var FORMATS = ['dd-MM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        var transitionOptions = {location : true, inherit : false, reload : false};
        var unsuscribeSearchModified = null;
        var unsuscribeExitSearch = null;
        var vm = this;
        angular.extend(vm, {
            activities : [],
            levels : [],
            costs : [],
            orderByPredicate: null,
            expandedCategory : null,
            searchData : {},
            searchQuery : null,
            searchCategory : null,
            searchSubCategory : null,
            searchLevel : null,
            searchDate : null,
            searchStartCost : 50000,
            searchEndCost : 250000,
            withCert : false,
            onWeekends : false,
            categories : [],
            format : FORMATS[0],
            minStartDate : new Date(),
            dateOptions : {
                formatYear : 'yyyy',
                startingDay : 1
            },
            activitiesPaginationOpts : {
                totalItems : 0,
                itemsPerPage : 12,
                pageNumber : 1,
                maxPagesSize : 10
            },
            opened : false,
            sliderOptions : {
                min : 30000,
                max : 1000000,
                step : 50000
            },
            orderByOptions : SearchManager.orderingOptions,
            getLevelClassStyle : getLevelClassStyle,
            openDatePicker : openDatePicker,
            expandCategory : _expandCategory,
            setCategory : setCategory,
            setSubCategory : setSubCategory,
            setLevel : setLevel,
            setDate : setDate,
            updateCost : updateCost,
            stopDrag : stopDrag,
            setCertification : setCertification,
            setWeekends : setWeekends,
            pageChange : pageChange,
            changeOrderBy : changeOrderBy,
            toggleSidebar: toggleSidebar,
            showSidebar: false
        });

        _activate();

        //--------- Exposed Functions ---------//

        function toggleSidebar(){
          vm.showSidebar = !vm.showSidebar;
        }

        function openDatePicker($event) {
            $event.preventDefault();
            $event.stopPropagation();
            vm.opened = true;
        }

        function setCategory(category, initializing) {
            if (!category) { return; }

            if (vm.searchCategory === category.id || category === vm.strings.ACTION_ALL_FILTER) {
                vm.searchCategory = null;
            } else {
                vm.searchCategory = category.id;
            }
            _expandCategory(category);
            SearchManager.setCategory(vm.searchCategory);

            if (!initializing){
                vm.searchSubCategory = null;
                SearchManager.setSubCategory(vm.searchSubCategory);
                _search();
            }
        }

        function setSubCategory(subcategory) {
            if (vm.searchSubCategory == subcategory.id) {
                vm.searchSubCategory = null;
            } else {
                vm.searchSubCategory = subcategory.id;
                vm.searchCategory = subcategory.category;
            }

            SearchManager.setCategory(vm.searchCategory);
            SearchManager.setSubCategory(vm.searchSubCategory);
            _search();
        }

        function setLevel() {
            SearchManager.setLevel(vm.searchLevel.code);
            _search();
        }

        function setDate() {
            SearchManager.setDate(vm.searchDate.getTime());
            _search();
        }

        function updateCost(costStart, costEnd) {
            SearchManager.setCosts(costStart, costEnd);
        }

        function stopDrag() {
            _search();
        }

        function setCertification() {
            vm.withCert = !vm.withCert;
            SearchManager.setCertification(vm.withCert);
            _search();
        }

        function setWeekends() {
            vm.onWeekends = !vm.onWeekends;
            SearchManager.setWeekends(vm.onWeekends);
            _search();
        }

        function pageChange() {
            _setPage();
            _search();
        }

        function changeOrderBy(predicate) {
            vm.activitiesPaginationOpts.pageNumber = 1;
            vm.searchData[SearchManager.KEY_ORDER] = predicate;
            SearchManager.setOrder(predicate);
            _setPage(1);
            _search();
        }

        function getLevelClassStyle(level) {
            return { 'btn-active' : vm.searchLevel ? vm.searchLevel.code === level.code : false };
        }

        //--------- Internal Functions ---------//

        function _expandCategory(category) {
            vm.expandedCategory = vm.expandedCategory == category.id ? null : category.id;
        }

        function _setPage(page){
            if(!page){ page = vm.activitiesPaginationOpts.pageNumber; }

            SearchManager.setPage(page);
            vm.searchData[SearchManager.KEY_PAGE] = page;
        }

        function _getActivities(searchData) {
            return SearchManager.searchActivities(searchData).then(success, error);

            function success(response) {
                vm.activities = response.activities;
                vm.activitiesPaginationOpts.totalItems = response.count;
                //console.log('_getActivities:', vm.activities);
            }

            function error() {
                console.log('_getActivities. Error obtaining Activities from ActivitiesManager');
            }
        }

        function _getSearchParams() {
            var sm = SearchManager;
            var deferred = $q.defer();
            sm.setPageSize(vm.activitiesPaginationOpts.itemsPerPage);
            vm.searchData = sm.getSearchData($stateParams);
            vm.searchQuery = vm.searchData[sm.KEY_QUERY];
            vm.activitiesPaginationOpts.pageNumber = vm.searchData[sm.KEY_PAGE];

            if ($stateParams.city) {
                var city = LocationManager.getCityById(parseInt($stateParams.city));
                LocationManager.setSearchCity(city);
            }

            if (vm.searchData.hasOwnProperty(sm.KEY_DATE)) {
                vm.searchDate = new Date(vm.searchData[sm.KEY_DATE]);
            }
            if (vm.searchData.hasOwnProperty(sm.KEY_LEVEL)) {
                _setLevel(vm.searchData[sm.KEY_LEVEL]);
            }

            if (vm.searchData.hasOwnProperty(sm.KEY_COST_START)) {
                vm.searchStartCost = vm.searchData[sm.KEY_COST_START];
            }
            if (vm.searchData.hasOwnProperty(sm.KEY_COST_END)) {
                vm.searchEndCost = vm.searchData[sm.KEY_COST_END];
            }

            if (vm.searchData.hasOwnProperty(sm.KEY_CERTIFICATION) && vm.searchData[sm.KEY_CERTIFICATION]) {
                vm.withCert = vm.searchData[sm.KEY_CERTIFICATION];
            }

            if (vm.searchData.hasOwnProperty(sm.KEY_WEEKENDS) && vm.searchData[sm.KEY_WEEKENDS]) {
                vm.onWeekends = vm.searchData[sm.KEY_WEEKENDS];
            }

            if (vm.searchData.hasOwnProperty(sm.KEY_CATEGORY)) {
                var category = vm.categories.filter(categoryFilter)[0];
                if (category) {
                    setCategory(category, true);
                    if (category) {
                        vm.searchData["category_display"] = category.name;
                        if (vm.searchData.hasOwnProperty(sm.KEY_SUBCATEGORY)) {
                            var subcategory = category.subcategories.filter(subCategoryFilter)[0];
                            vm.searchSubCategory = vm.searchData[sm.KEY_SUBCATEGORY];
                            SearchManager.setSubCategory(vm.searchSubCategory);
                            if (subcategory) {
                                vm.searchData["subcategory_display"] = subcategory.name;
                            }
                        }
                    }
                }
            }

            deferred.resolve();
            return deferred.promise;

            function _setLevel(level) {
                vm.searchLevel = {'code' : level};
            }

            function categoryFilter(category) {
                return category.id === vm.searchData[sm.KEY_CATEGORY];
            }

            function subCategoryFilter(subcategory) {
                return subcategory.id === vm.searchData[sm.KEY_SUBCATEGORY];
            }
        }

        function _setGeneralInfo() {
            vm.levels = generalInfo.levels;
            vm.categories = generalInfo.categories;
            angular.extend(vm.sliderOptions, generalInfo.price_range);
            vm.searchEndCost = vm.sliderOptions.max;
        }

        function _setWatches() {
            $rootScope.$watch(watchStartCost, function (newValue) {
                SearchManager.setCosts(newValue, vm.searchEndCost);
            });

            $rootScope.$watch(watchEndCost, function (newValue) {
                SearchManager.setCosts(vm.searchStartCost, newValue);
            });

            function watchStartCost() { return vm.searchStartCost; }

            function watchEndCost() { return vm.searchEndCost; }
        }

        function _scrollToCurrentCategory() {
            $location.hash(vm.searchData["category_display"]);
            $anchorScroll();
        }

        function _search() {
            var searchData = SearchManager.getSearchData();
            $state.go('search', searchData, transitionOptions);
        }

        function _setStrings() {
            if (!vm.strings) { vm.strings = {}; }
            angular.extend(vm.strings, {
                ACTION_CLOSE : "Cerrar",
                ACTION_ALL_FILTER : "Todas",
                COPY_RESULTS : "resultados ",
                COPY_FOR : "para ",
                COPY_IN : "en",
                OPTION_SELECT_LEVEL : "-- Nivel --",
                PLACEHOLDER_DATE : "A Partir de",
                COPY_INTERESTS : "¿Qué tema te interesa?",
                LABEL_SORT_BY: "Ordenar por",
                LABEL_LEVEL : "Nivel",
                LABEL_COST : "Precio",
                LABEL_DATE : "Fecha",
                LABEL_WITH_CERTIFICATE : "Con Certificado",
                LABEL_WEEKENDS : "Fines de Semana",
                LABEL_EMPTY_SEARCH : "Houston, tenemos un problema.",
                COPY_EMPTY_SEARCH : "Puede que no tengamos lo que estés buscando."
                + " Por si acaso, te recomendamos intentarlo de nuevo."
            });
        }

        function _cleanUp() {
            unsuscribeSearchModified();
            //unsuscribeExitSearch();
        }

        function _activate() {
            datepickerPopupConfig.showButtonBar = false;
            datepickerConfig.showWeeks = false;
            _setWatches();
            _setStrings();
            _setGeneralInfo();
            _getSearchParams();

            _getActivities($stateParams).then(function () {
                _scrollToCurrentCategory();
            });

            unsuscribeSearchModified = $rootScope.$on(SearchManager.EVENT_SEARCH_MODIFIED, function (event) {
                    console.log('searchBar. on' + SearchManager.EVENT_SEARCH_MODIFIED);
                    _getSearchParams().then(function () {
                        _getActivities($stateParams);
                    });
                }
            );

            unsuscribeExitSearch = $rootScope.$on('$stateChangeStart', function (e, toState, toParams, fromState) {
                if (toState.name !== 'search') {
                    SearchManager.clearData();
                    unsuscribeExitSearch();
                }
            });
            $scope.$on('$destroy', _cleanUp);
        }
    }
})();
