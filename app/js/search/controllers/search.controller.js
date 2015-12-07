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

    SearchController.$inject = ['$rootScope', '$scope','$filter', '$q', '$location','$anchorScroll', '$timeout', '$state', '$stateParams', 'generalInfo','ActivitiesManager', 'LocationManager', 'SearchManager',
        'datepickerConfig', 'datepickerPopupConfig' ];

    function SearchController($rootScope, $scope, $filter, $q, $location,$anchorScroll, $timeout, $state, $stateParams, generalInfo, ActivitiesManager, LocationManager, SearchManager,
          datepickerConfig, datepickerPopupConfig ) {

        var FORMATS = ['dd-MM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        var unsuscribeSearchModified = null;
        var activities = [];
        var vm = this;
        var ORDERING_BY_SCORE_KEY = 'score';
        var ORDERING_BY_SOONEST_DATE_KEY  = 'calendar_soonest';
        var ORDERING_BY_LOWEST_PRICE_KEY  = 'closest_calendar.session_price';
        var ORDERING_BY_HIGHEST_PRICE_KEY = '-closest_calendar.session_price';
        var ORDERING_BY_ASSISTANT_AMOUNT_KEY  = '-closest_calendar.assistants.length';
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
                formatYear: 'yyyy',
                startingDay: 1
            },
            activitiesPaginationOpts: {
                totalItems: 0,
                itemsPerPage: 12,
                pageNumber: 1,
                maxPagesSize:10,
            },
            opened: false,
            sliderOptions: {
                min: 30000,
                max: 1000000,
                step: 50000
            },
            orderByOptions:[
                {
                    'predicate':ORDERING_BY_LOWEST_PRICE_KEY,
                    'name':'Menor precio'
                },
                {
                    'predicate':ORDERING_BY_HIGHEST_PRICE_KEY,
                    'name':'Mayor precio'
                },
                {
                    'predicate':ORDERING_BY_SCORE_KEY,
                    'name':'Relevancia'
                },
                {
                    'predicate':ORDERING_BY_SOONEST_DATE_KEY,
                    'name':'Más próxima'
                },
                 {
                    'predicate':ORDERING_BY_ASSISTANT_AMOUNT_KEY,
                    'name':'Asistentes'
                },               

            ],
            pageChange:pageChange,
            getLevelClassStyle: getLevelClassStyle,
            openDatePicker: openDatePicker,
            expandCategory: expandCategory,
            setCategory: setCategory,
            setSubCategory: setSubCategory,
            setLevel: setLevel,
            setDate: setDate,
            updateCost: updateCost,
            stopDrag:stopDrag,
            setCertification: setCertification,
            setWeekends: setWeekends,
            changeOrderBy:changeOrderBy,


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

            SearchManager.setCategory(vm.searchCategory);
            SearchManager.setSubCategory(vm.searchSubCategory);
            var transitionOptions = {location: true, inherit: false,reload:false};
            
            $state.go('search', SearchManager.getSearchData(),transitionOptions);
        }

        function setLevel(){
            console.log('setLevel:', vm.searchLevel);
            SearchManager.setLevel(vm.searchLevel.code);
            _search();
        }

        function setDate(){
            console.log('setDate:', vm.searchDate.getTime());
            SearchManager.setDate(vm.searchDate.getTime());
            _search();
        }

        function updateCost(costStart, costEnd){
            SearchManager.setCosts(costStart, costEnd);
        }

        function stopDrag(){
            _search();
        }

        function setCertification(){
            vm.withCert = !vm.withCert;
            console.log('setCert:', vm.withCert);
            SearchManager.setCertification(vm.withCert);
            _search();
        }

        function setWeekends(){
            vm.onWeekends = !vm.onWeekends;
            console.log('setWeekends:', vm.onWeekends);
            SearchManager.setWeekends(vm.onWeekends);
            _search();
        }

        function pageChange(){
            var offset = null;
            var start = null;
            var end = null;
            offset = vm.activitiesPaginationOpts.itemsPerPage;
            start = (vm.activitiesPaginationOpts.pageNumber -1) * offset;
            end = vm.activitiesPaginationOpts.pageNumber * offset;
            vm.activities = activities.slice(start, end);
            console.log('activities:', vm.activities);
        }

        function changeOrderBy(predicate){
            console.log("pedricado",predicate);
            if (predicate === ORDERING_BY_SOONEST_DATE_KEY)
                activities = $filter('orderBy')(activities,_orderBySoonestDate);
            else
                activities = $filter('orderBy')(activities,predicate);
            
            vm.activitiesPaginationOpts.pageNumber = 1;
            pageChange();
        }

        function getLevelClassStyle(level) {
            return {
                'btn-active' : vm.searchLevel? vm.searchLevel.code === level.code : false
            };
        }

        //--------- Internal Functions ---------//

        function _orderBySoonestDate(activity){
            var today = Date.now();
            if (activity.closest_calendar.initial_date < today){
                return activity.closest_calendar.initial_date;
            }
            return -activity.closest_calendar.initial_date;
        }

        function _getActivities(data){
            return SearchManager.searchActivities(data).then(success, error);

            function success(response){
                activities = response.activities;
                vm.activitiesPaginationOpts.totalItems = activities.length;
                vm.activities = activities.slice(0, vm.activitiesPaginationOpts.itemsPerPage);
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
            if(vm.searchData.hasOwnProperty(sm.KEY_LEVEL)){_setLevel(vm.searchData[sm.KEY_LEVEL]);}
            
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


            function _setLevel(level){ vm.searchLevel = {'code':level};}
            function categoryFilter(category){ return category.id === vm.searchData[sm.KEY_CATEGORY]; }
            function subCategoryFilter(subcategory){ return subcategory.id === vm.searchData[sm.KEY_SUBCATEGORY]; }
        }

        function _setGeneralInfo(){

            vm.levels = generalInfo.levels;
            vm.categories = generalInfo.categories;
            angular.extend(vm.sliderOptions,generalInfo.price_range);
            vm.searchEndCost= vm.sliderOptions.max;


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

        function _scrollToCurrentCategory(){

            $location.hash(vm.searchData["category_display"]);
            $anchorScroll();

        }

        function _search(){
            var searchData = SearchManager.getSearchData();
            var transitionOptions = {location: true, inherit: false};
            $state.go('search', searchData,transitionOptions);
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
            _setGeneralInfo();
            _getSearchParams();

            _getActivities($stateParams).then(function(){
                _scrollToCurrentCategory();

            });
            vm.orderByPredicate = 'closest_calendar.session_price';
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
