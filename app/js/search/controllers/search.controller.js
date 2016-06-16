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
            , '$window', '$stateParams', 'generalInfo', 'ActivitiesManager', 'LocationManager', 'SearchManager'
            , 'datepickerConfig', 'datepickerPopupConfig', 'Analytics', 'serverConf'];

    function SearchController($rootScope, $scope, $q, $location, $anchorScroll, $state
            , $window, $stateParams , generalInfo, ActivitiesManager, LocationManager, SearchManager
            , datepickerConfig, datepickerPopupConfig, Analytics, serverConf) {

        var FORMATS = ['dd-MM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        var transitionOptions = {location : true, inherit : false, reload : false};
        var unsuscribeSearchModified = null;
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
            isFree: false,
            categories : [],
            format : FORMATS[0],
            minStartDate : new Date(),
            dateOptions : {
                formatYear : 'yyyy',
                formatDayHeader : "EEE",
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
            showSidebar: false,
            toggleFilters: toggleFilters,
            showFilters: false,
            newSearchQuery: '',
            loadingActivities: true,
            getAmazonUrl: getAmazonUrl,
            cards: [],
            expandedSort: false,
            toggleExpandedSort: toggleExpandedSort,
            cities: [],
            searchCity: null,
            triggerSearch: triggerSearch,
            updateCity: updateCity,
            setFree: setFree
        });

        _activate();

        //--------- Exposed Functions ---------//
        
        function updateCity(){
            LocationManager.setSearchCity(vm.searchCity);
        }
        
        function toggleExpandedSort(){
            vm.expandedSort = !vm.expandedSort;
        }
        
        function getAmazonUrl(file){
            return  serverConf.s3URL + '/' +  file;
        }


        function toggleFilters(){
          vm.showFilters = !vm.showFilters;
        }

        function openDatePicker($event) {
            $event.preventDefault();
            $event.stopPropagation();
            vm.opened = true;
        }

        function setCategory(category, initializing) {
            if (!category) { return; }

            if (vm.searchCategory === category.id || category === vm.strings.ACTION_ALL_FILTER) {
                vm.searchCategory = undefined;
            } else {
                vm.searchCategory = category.id;
                vm.searchData["category_display"] = category.name;
            }

            _expandCategory(category);
            SearchManager.setCategory(vm.searchCategory);

            if (!initializing){
                vm.searchSubCategory = undefined;
                SearchManager.setSubCategory(vm.searchSubCategory);
                if(!_isMobile()){
                  _search();
                }
            }
            Analytics.generalEvents.searchCategory(category.name);
        }

        function setSubCategory(subcategory) {
            if (vm.searchSubCategory == subcategory.id) {
                vm.searchSubCategory = undefined;
            } else {
                vm.searchSubCategory = subcategory.id;
                vm.searchCategory = subcategory.category;
                vm.searchData["subcategory_display"] = subcategory.name;
            }

            SearchManager.setCategory(vm.searchCategory);
            SearchManager.setSubCategory(vm.searchSubCategory);
            if(!_isMobile()){
              _search();
            }

            Analytics.generalEvents.searchSubCategory(subcategory.name);
        }

        function setLevel(level) {
          var sm = SearchManager;
          vm.searchData = SearchManager.getSearchData();

          if(vm.searchData[sm.KEY_LEVEL] === vm.searchLevel.code){
            vm.searchLevel=undefined;
            SearchManager.setLevel(undefined);
            Analytics.generalEvents.searchLevel('');
          }
          else{
            SearchManager.setLevel(vm.searchLevel.code);
            Analytics.generalEvents.searchLevel(vm.searchLevel.value);
          }

          if(!_isMobile()){
            _search();
          }

        }

        function setDate() {
            SearchManager.setDate(vm.searchDate.getTime());
            if(!_isMobile()){
              _search();
            }
            Analytics.generalEvents.searchDate(vm.searchDate);
        }

        function setFree(){
            console.log(vm.isFree);
            vm.searchData[SearchManager.KEY_FREE] = vm.isFree;
            if(!_isMobile()){
              _search();
            }
        }

        function updateCost(costStart, costEnd) {
            SearchManager.setCosts(costStart, costEnd);
        }

        function stopDrag() {
            if(!_isMobile()){
                Analytics.generalEvents.searchRange(vm.searchData.cost_start+'-'+vm.searchData.cost_end);
              _search();
            }
        }

        function setCertification() {
            vm.withCert = !vm.withCert;
            SearchManager.setCertification(vm.withCert);
            vm.searchData[SearchManager.KEY_CERTIFICATION] = vm.withCert;
            Analytics.generalEvents.searchCertificate(vm.withCert);
            if(!_isMobile()){
              _search();
            }
        }

        function setWeekends() {
            vm.onWeekends = !vm.onWeekends;
            SearchManager.setWeekends(vm.onWeekends);
            vm.searchData[SearchManager.KEY_WEEKENDS] = vm.onWeekends;
            Analytics.generalEvents.searchWeekends(vm.onWeekends);
            if(!_isMobile()){
              _search();
            }
        }

        function pageChange() {
            _setPage();
            if(!_isMobile()){
              _search();
            }
        }

        function changeOrderBy(predicate) {
            vm.activitiesPaginationOpts.pageNumber = 1;
            vm.searchData[SearchManager.KEY_ORDER] = predicate;
            SearchManager.setOrder(predicate);
            _setPage(1);
            if(!_isMobile()){
              _search();
            }
        }

        function getLevelClassStyle(level) {
            return { 'btn-active' : vm.searchLevel ? vm.searchLevel.code === level.code : false };
        }

        function triggerSearch(){
          _search();
        }

        //--------- Internal Functions ---------//

        function _isMobile(){
          return $window.innerWidth < 992;
        }
        function _expandCategory(category) {
            vm.expandedCategory = vm.expandedCategory == category.id ? null : category.id;
        }

        function _setPage(page){
            if(!page){ page = vm.activitiesPaginationOpts.pageNumber; }
            page = page.toString();
            SearchManager.setPage(page);
            vm.searchData[SearchManager.KEY_PAGE] = page;
        }

        function _getActivities(searchData) {
            return SearchManager.searchActivities(SearchManager.getSearchData()).then(success, error);

            function success(response) {
                vm.activities = response.activities;
                vm.activitiesPaginationOpts.totalItems = response.count;
                vm.loadingActivities = false;
                
                for(var i = 0; i < vm.activities.length; i++){
                    vm.activities[i].template = "partials/activities/dynamic_layout_item.html";
                }
            
                vm.cards = vm.activities;
            }

            function error(error) {
              console.log(error);
                console.log('_getActivities. Error obtaining Activities from ActivitiesManager');

            }
        }

        function _getSearchParams() {
            var sm = SearchManager;
            var deferred = $q.defer();
            sm.setPageSize(vm.activitiesPaginationOpts.itemsPerPage);
            vm.searchData = sm.getSearchData($stateParams);
            vm.searchQuery = vm.searchData[sm.KEY_QUERY];
            vm.newSearchQuery = vm.searchData[sm.KEY_QUERY];
            vm.activitiesPaginationOpts.pageNumber = vm.searchData[sm.KEY_PAGE];
            

            if ($stateParams.city) {
                var city = LocationManager.getCityById(parseInt($stateParams.city));
                LocationManager.setSearchCity(city);
                vm.searchCity = city;
            }

            if (vm.searchData.hasOwnProperty(sm.KEY_DATE)) {
                vm.searchDate = new Date(vm.searchData[sm.KEY_DATE]);
            }

            if (vm.searchData.hasOwnProperty(sm.KEY_ORDER)) {
                vm.orderByPredicate = vm.searchData[sm.KEY_ORDER];
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
            if (vm.searchData.hasOwnProperty(sm.KEY_FREE) && vm.searchData[sm.KEY_FREE]) {
                vm.isFree = vm.searchData[sm.KEY_FREE];
            }

            if (vm.searchData.hasOwnProperty(sm.KEY_CATEGORY)) {
                var category = vm.categories.filter(categoryFilter)[0];
                if (category) {
                    setCategory(category, true);
                    if (category) {
                        vm.searchData["category_display"] = category.name;
                        console.log(category.name);
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
            vm.loadingActivities = true;
            SearchManager.setQuery(vm.newSearchQuery);

            vm.searchData = SearchManager.getSearchData();

            SearchManager.getSearchData(vm.searchData);
            
            
             _getActivities(vm.searchData).then(function () {
                //_scrollToCurrentCategory();
                $state.go('search', vm.searchData,  {notify: false});
            });
        
        }

        function _setStrings() {
            if (!vm.strings) { vm.strings = {}; }
            angular.extend(vm.strings, {
                ACTION_CLOSE : "Cerrar",
                ACTION_ALL_FILTER : "Todas",
                COPY_RESULTS : "resultados ",
                COPY_FOR : "para ",
                COPY_IN : "en",
                LABEL_SORT_BY: "Ordenar por",
                LABEL_LEVEL : "Nivel",
                LABEL_COST : "Precio",
                LABEL_DATE : "Fecha de inicio",
                LABEL_OTHERS: "Otros",
                LABEL_WITH_CERTIFICATE : "Con certificado",
                LABEL_WEEKENDS : "Fines de Semana",
                LABEL_EMPTY_SEARCH : "Houston, tenemos un problema.",
                COPY_EMPTY_SEARCH : "Puede que no tengamos lo que estés buscando."
                + " Por si acaso, te recomendamos intentarlo de nuevo.",
                LABEL_FILTER_ACTIVITIES: "Filtrar actividades",
                LABEL_FREE: "Clases gratis"
            });
        }

        function _cleanUp() {
            unsuscribeSearchModified();
            //unsuscribeExitSearch();
        }
        
        function _setCities(){
            LocationManager.getAvailableCities().then(function(data){
                vm.cities = data;
            });
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
            _setCities();
            

            unsuscribeSearchModified = $rootScope.$on(SearchManager.EVENT_SEARCH_MODIFIED, function (event, data) {
                    angular.extend(data, SearchManager.getSearchData());
                    vm.searchData = data;
                    _search();
                }
            );


            $scope.$on('$destroy', _cleanUp);
        }
    }
})();
