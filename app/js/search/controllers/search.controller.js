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

    SearchController.$inject = ['$rootScope', '$scope', '$stateParams', 'ActivitiesManager', 'SearchManager', 'datepickerPopupConfig'];

    function SearchController($rootScope, $scope, $stateParams, ActivitiesManager, SearchManager, datepickerPopupConfig) {

        var FORMATS = ['dd-MM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
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
            categories: [
                {
                    name: "Arte",
                    color: "#46416D"
                },
                {
                    name: "Danza",
                    color: "#38DBC7"
                },
                {
                    name: "Estilo de Vida",
                    color: "#00AAD1"
                },
                {
                    name: "Fitness",
                    color: "#C177EF"
                },
                {
                    name: "Gastronomía",
                    color: "#EB5369"
                },
                {
                    name: "Geeks",
                    color: "#00AA79"
                },
                {
                    name: "Idioma",
                    color: "#FF7E60"
                },
                {
                    name: "Música",
                    color: "#0084B4"
                },
                {
                    name: "Niños",
                    color: "#FFC971"
                },
                {
                    name: "Profesional",
                    color: "#EB9F61"
                }
            ],
            format : FORMATS[0],
            minStartDate : new Date(),
            dateOptions : {
                formatYear: 'yy',
                startingDay: 1
            },
            opened: false,
            options : {
                actions: ['view', 'edit', 'contact', 'manage', 'republish']
            },
            openDatePicker: openDatePicker,
            expandCategory: expandCategory,
            setCategory: setCategory,
            setSubCategory: setSubCategory,
            setLevel: setLevel,
            setDate: setDate,
            setCertification: setCertification,
            setWeekends: setWeekends
        });

        _activate();

        //--------- Exposed Functions ---------//

        function openDatePicker($event){
            console.log('openDatePicker');
            $event.preventDefault();
            $event.stopPropagation();

            vm.opened = true;
        }

        function expandCategory(category){
            console.log('expandCategory:', category.id);
            vm.expandedCategory = vm.expandedCategory == category.id? null : category.id;
        }

        function setCategory(category){
            if(vm.searchCategory === category.id){
                vm.searchCategory = null;
            } else {
                vm.searchCategory = category.id;
            }
            vm.searchSubCategory = null;
            console.log('setCategory:', vm.searchCategory);
            SearchManager.setCategory(vm.searchCategory);
        }

        function setSubCategory(subcategory){
            if(vm.searchSubCategory == subcategory.id){
                vm.searchSubCategory = null;
            } else {
                vm.searchSubCategory = subcategory.id;
                vm.searchCategory = subcategory.category;
            }

            console.log('setSubCategory:', vm.searchSubCategory);
            SearchManager.setSubCategory(vm.searchSubCategory);
        }

        function setLevel(){
            console.log('setLevel:', vm.searchLevel);
            SearchManager.setLevel(vm.searchLevel);
        }

        function setDate(){
            console.log('setDate:', vm.searchDate.getTime());
            SearchManager.setDate(vm.searchDate.getTime());
        }

        function setCertification(){
            console.log('setCert:', vm.withCert);
            SearchManager.setCertification(vm.withCert);
        }

        function setWeekends(){
            console.log('setWeekends:', vm.onWeekends);
            SearchManager.setWeekends(vm.onWeekends);
        }

        //--------- Internal Functions ---------//

        function _getActivities(){
            ActivitiesManager.getActivities().then(success, error);

            function success(response){
                vm.activities = response;
                console.log('activities from ActivitiesManager:', vm.activities);
            }
            function error(response){
                console.log('getActivities. Error obtaining Activities from ActivitiesManager');
            }
        }

        function _getSearchParams(){
            vm.searchData = SearchManager.getSearchData();
            vm.searchQuery = vm.searchData[SearchManager.KEY_QUERY];
            console.log('searchData:', vm.searchData);
            console.log('searchQuery:', vm.searchQuery);
        }

        function _getSearchData(){
            ActivitiesManager.loadGeneralInfo().then(successInfo, errorInfo);
            ActivitiesManager.getCategories().then(successCategories, errorCategories);

            function successInfo(response){
                console.log('generalInfo:', response);
                vm.levels = response.levels;
            }

            function errorInfo(response){
                console.log('Error getting GeneralInfo.', response.data);
            }

            function successCategories(categories){
                console.log('categories:', categories);
                vm.categories = categories;
            }
            function errorCategories(response){
                console.log('Error getting Categories.', response.data);
            }
        }

        function _setWatches(){
            $rootScope.$watch(watchStartCost , function(newValue){
                console.log('searchStartCost:', newValue);
                SearchManager.setCostStart(newValue);
            });

            $rootScope.$watch(watchEndCost, function(newValue){
                console.log('searchEndCost:', newValue);
                SearchManager.setCostEnd(newValue);
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
                OPTION_SELECT_LEVEL: "Nivel...",
                OPTION_SELECT_COST: "Costo...",
                OPTION_SELECT_DATA: "Fecha...",
                LABEL_LEVEL: "Nivel",
                LABEL_COST: "Costo",
                LABEL_DATE: "Fecha"
            });
        }

        function _activate(){
            datepickerPopupConfig.showButtonBar = false;
            _setStrings();
            _getSearchData();
            _getSearchParams();
            if($stateParams.activities){
                console.log('activities from $stateParams:', $stateParams.activities);
                vm.activities = $stateParams.activities;
            } else {
                _getActivities();
            }

            _setWatches();

            $scope.$on('$destroy', clearData);

            function clearData(){
                SearchManager.clearData();
            }
        }



    }
})();