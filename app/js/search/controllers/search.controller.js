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

    SearchController.$inject = ['$rootScope', '$scope', '$q', '$state', '$stateParams', '$timeout'
            , 'generalInfo', 'ActivitiesManager', 'LocationManager', 'SearchManager'
            , 'datepickerConfig', 'datepickerPopupConfig', 'Analytics', 'serverConf', 'Elevator'];

    function SearchController($rootScope, $scope, $q, $state, $stateParams, $timeout
            , generalInfo, ActivitiesManager, LocationManager, SearchManager
            , datepickerConfig, datepickerPopupConfig, Analytics, serverConf, Elevator) {


        var FORMATS = ['dd-MM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        var transitionOptions = {location : true, inherit : false, reload : false};
        var unsuscribeSearchModified = null;
        var vm = this;
        angular.extend(vm, {
            activities : [],
            levels : [],
            costs : [],
            orderByPredicate: null,
            expandedCategories : [],
            searchData : {},
            searchQuery : null,
            searchCategory : null,
            searchSubCategory : null,
            searchLevel : null,
            searchDate : null,
            searchStartCost : 50000,
            searchEndCost : 1000000,
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
            updateCity: updateCity,
            setFree: setFree,
            freeOptions: freeOptions,
            searchAll:searchAll,
            checkboxFilters: {
                withCert : false,
                onWeekends : false,
                isFree: false,
            },
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
        function searchAll(){
            vm.searchCategory = undefined;
            vm.searchSubCategory = undefined;
            vm.newSearchQuery = undefined;
            SearchManager.setQuery(vm.newSearchQuery);
            SearchManager.setSubCategory(vm.searchSubCategory);
            SearchManager.setCategory(vm.searchCategory);
            _setPage(1);
            _search();
            _collapseCategories();


        }
        function setCategory(category, initializing, $event) {

            if ($event){$event.preventDefault();$event.stopPropagation();}
            if (!category) { return; }
            vm.newSearchQuery = SearchManager.getQueryChange();

            vm.searchCategory = category.id;
            vm.searchData["category_display"] = category.name;

            SearchManager.setCategory(vm.searchCategory);

            if (!initializing){
                vm.searchSubCategory = undefined;
                SearchManager.setSubCategory(vm.searchSubCategory);
                vm.toggleFilters();
                _setPage(1);
                _search();
            }
            else{
                _expandCategory(category);
            }
            Analytics.generalEvents.searchCategory(category.name);
        }
        function setSubCategory(subcategory, $event) {
            $event.preventDefault();
            $event.stopPropagation();
            vm.newSearchQuery = SearchManager.getQueryChange();
            if (vm.searchSubCategory == subcategory.id) {
                vm.searchSubCategory = undefined;
            } else {
                vm.searchSubCategory = subcategory.id;
                vm.searchCategory = _.find(vm.categories, { 'id': subcategory.category});
                vm.searchData["subcategory_display"] = subcategory.name;
                vm.searchData["category_display"] = vm.searchCategory.name;
            }
            SearchManager.setCategory(vm.searchCategory.id);
            SearchManager.setSubCategory(vm.searchSubCategory);
            vm.toggleFilters();
            _setPage(1);
            _search();

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
          vm.toggleFilters();
          _setPage(1);
          _search();

        }

        function setDate() {
            SearchManager.setDate(vm.searchDate.getTime());
            _setPage(1);
            _search();
            Analytics.generalEvents.searchDate(vm.searchDate);
        }

        function updateCost(costStart, costEnd) {
            SearchManager.setCosts(costStart, costEnd);
        }

        function stopDrag() {
            Analytics.generalEvents.searchRange(vm.searchData.cost_start+'-'+vm.searchData.cost_end);
            _setPage(1);
            _search();
        }

        function setFree(){
            if(vm.checkboxFilters.isFree){
                SearchManager.setFree(true);
                document.getElementById('slider-anchor').setAttribute('disabled', true);
            }
            else{
                SearchManager.setFree(false);
                document.getElementById('slider-anchor').removeAttribute('disabled');
            }
            _setPage(1);
            _search();
        }

        function setCertification() {
            if(vm.checkboxFilters.withCert){
                SearchManager.setCertification(true);
            }
            else{
                SearchManager.setCertification(false);
            }
            Analytics.generalEvents.searchCertificate(vm.checkboxFilters.withCert);
            vm.toggleFilters();
            _setPage(1);
            _search();
        }

        function setWeekends() {
            if(vm.checkboxFilters.onWeekends){
                SearchManager.setWeekends(true);
            }
            else{
                SearchManager.setWeekends(false);
            }
            Analytics.generalEvents.searchWeekends(vm.checkboxFilters.onWeekends);
            _setPage(1);
            _search();
        }

        function pageChange() {
            _setPage();
            _search();
            Elevator.toTop();
        }

        function changeOrderBy(predicate) {
            vm.activitiesPaginationOpts.pageNumber = 1;
            SearchManager.setOrder(predicate);
            vm.toggleFilters();
            _setPage(1);
            _search();
        }

        function getLevelClassStyle(level) {
            return { 'btn-active' : vm.searchLevel ? vm.searchLevel.code === level.code : false };
        }

        function freeOptions(option){
            return ! ((option.predicate === 'min_price' || option.predicate === 'max_price')  && vm.checkboxFilters.isFree);
        }
        //--------- Internal Functions ---------//

        function _collapseCategories(){
            vm.expandedCategories.pop();
            vm.expandedCategories.pop();
        }
        function _expandCategory(category) {

            if (!vm.searchCategory){
                vm.expandedCategories.pop();
                vm.expandedCategories.push(category.id);
                return;
            }

            // In category is already expanded, contract it.
            if (_.includes(vm.expandedCategories, category.id)){
                vm.expandedCategories.splice(0);
                vm.expandedCategories.push(vm.searchCategory.id);
                return;
            }

            vm.expandedCategories.splice(0);
            vm.expandedCategories.push(category.id);
            vm.expandedCategories.push(vm.searchCategory.id);

        }

        function _setPage(page){
            if(!page)
                page = vm.activitiesPaginationOpts.pageNumber;
            else
                vm.activitiesPaginationOpts.pageNumber = page;

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
                console.log('_getActivities. Error obtaining Activities from ActivitiesManager');

            }
        }

        function _getSearchParams() {
            var sm = SearchManager;
            var deferred = $q.defer();
            sm.setPageSize(vm.activitiesPaginationOpts.itemsPerPage);

            var searchData = angular.copy($stateParams);
            vm.searchData = sm.getSearchData(searchData);
            vm.searchQuery = vm.searchData[sm.KEY_QUERY];
            vm.newSearchQuery = vm.searchData[sm.KEY_QUERY];
            vm.activitiesPaginationOpts.pageNumber = vm.searchData[sm.KEY_PAGE];


            if ($stateParams.city) {
                LocationManager.getCityById(parseInt($stateParams.city)).then(function(city){
                     LocationManager.setSearchCity(city);
                     vm.searchCity = city;
                });

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

            if (vm.searchData.hasOwnProperty(sm.KEY_QUERY)) {
                vm.searchQuery = vm.searchData[sm.KEY_QUERY];
            }

            if (vm.searchData.hasOwnProperty(sm.KEY_CERTIFICATION) && vm.searchData[sm.KEY_CERTIFICATION])  {
                vm.checkboxFilters.withCert = vm.searchData[sm.KEY_CERTIFICATION] === true;
            }

            if (vm.searchData.hasOwnProperty(sm.KEY_WEEKENDS) && vm.searchData[sm.KEY_WEEKENDS]) {
                vm.checkboxFilters.onWeekends = vm.searchData[sm.KEY_WEEKENDS] === true;
            }

            if (vm.searchData.hasOwnProperty(sm.KEY_FREE) && vm.searchData[sm.KEY_FREE]) {
                vm.checkboxFilters.isFree = vm.searchData[sm.KEY_FREE] === true;
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

        function _search() {
            vm.loadingActivities = true;
            SearchManager.setQuery(vm.newSearchQuery);

            vm.searchData = SearchManager.getSearchData();
            _getActivities(vm.searchData).then(function () {
                $state.go('search', vm.searchData,  {notify:false, reload:false, inherit:false});
            });

        }
        
        
         function _removeScriptSeo() {
            var element = document.getElementById('seoJson');
            if(!element){
                return true;
            }else{
                 document.getElementsByTagName("head")[0].removeChild (element);
                 _removeScriptSeo();
            }
        }
        function _initObjectsSeo(){
            var websiteObj = {  
                "@context":"http://schema.org",
                "@type":"WebSite",
                "name":"Trulii",
                "url":"https://www.trulii.com",
                "potentialAction":{  
                    "@type":"SearchAction",
                    "target":"https://www.trulii.com/buscar?q=search_term_string&city=1",
                    "query-input":"required name=search_term_string"
                }
            }
             _removeScriptSeo();
            _setSeoScript(websiteObj);
           
        }
        function  _setSeoScript(dataObj) {
            var script   = document.createElement("script");
            script.type  = "application/ld+json"; // use this for linked script
            script.text  = JSON.stringify(dataObj);
            script.id= "seoJson";
            
            document.getElementsByTagName("head")[0].appendChild(script); 
            
            //document.querySelector('script[type="application/ld+json"]')
        }


        function _setStrings() {
            if (!vm.strings) { vm.strings = {}; }
            angular.extend(vm.strings, {
                ACTION_CLOSE : "Cerrar",
                ACTION_ALL_FILTER : "Todas",
                ACTION_ALL_ACTIVITIES: "Ver todas las actividades",
                COPY_RESULTS : "resultados ",
                COPY_FOR : "para ",
                COPY_IN : "en",
                LABEL_SORT_BY: "Ordenar por",
                LABEL_LEVEL : "Nivel",
                LABEL_COST : "Precio",
                LABEL_DATE : "A partir de",
                LABEL_OTHERS: "Otros",
                LABEL_WITH_CERTIFICATE : "Con certificado",
                LABEL_WEEKENDS : "Fines de Semana",
                LABEL_EMPTY_SEARCH : "Houston, tenemos un problema."
                + " Puede que no tengamos lo que estés buscando."
                + " Por si acaso, te recomendamos intentarlo de nuevo.",
                LABEL_FILTER_ACTIVITIES: "Filtrar actividades",
                LABEL_FREE: "Actividades gratuitas"
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
            _getActivities($stateParams);
            _setCities();
            unsuscribeSearchModified = $rootScope.$on(SearchManager.EVENT_SEARCH_MODIFIED, function (event) {
                    vm.searchData = SearchManager.getSearchData();
                    _setPage(1);
                    _getActivities(vm.searchData).then(function () {
                        $state.go('search', vm.searchData,  {notify:false, reload:false, inherit:false});
                    });
                }
            );

            $rootScope.$on(SearchManager.EVENT_QUERY_MODIFIED, function(){
                vm.searchQuery = SearchManager.getQuery();
                vm.newSearchQuery = SearchManager.getQuery();

            });

            angular.element(document).ready(function () {

                    $timeout(function(){
                        if(vm.checkboxFilters.isFree === true){
                            document.getElementById('slider-anchor').setAttribute('disabled', true);
                        }
                    });

            });
            _initObjectsSeo();

            $scope.$on('$destroy', _cleanUp);
            
            //Function for angularSeo
            $scope.htmlReady();
        }
    }
})();
