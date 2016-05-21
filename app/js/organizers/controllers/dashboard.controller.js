/**
 * @ngdoc controller
 * @name trulii.organizers.controllers.OrganizerDashboardCtrl
 * @description Handles Organizer Dashboard
 * @requires ui.router.state.$state
 */

(function () {
    'use strict';

    angular
        .module('trulii.organizers.controllers')
        .controller('OrganizerDashboardCtrl', OrganizerDashboardCtrl);

    OrganizerDashboardCtrl.$inject = ['$state', '$scope', '$window', 'unreadReviewsCount', 'Analytics', 'serverConf'];
    function OrganizerDashboardCtrl($state, $scope, $window, unreadReviewsCount, Analytics, serverConf) {

        var vm = this;
        angular.extend(vm, {
            isActive: isActive,
            unreadReviewsCount: unreadReviewsCount,
            scroll: 0,
            showSidebar: false,
            toggleSidebar: toggleSidebar,
            clicItemDash:clicItemDash,
            getAmazonUrl: getAmazonUrl,
            subItems: {},
            showSubItems: showSubItems,
            titleActive: ''
        });


        _activate();

        function getAmazonUrl(file){
            return  serverConf.s3URL + '/' +  file;
        }
        
        function isActive(stateStr, title){
            if($state.includes(stateStr) && title)
                vm.titleActive = title;
                
            return $state.includes(stateStr);
        }

        function toggleSidebar(){
            vm.showSidebar = !vm.showSidebar;
            console.log(vm.showSidebar);
        }
        
        function  showSubItems(item) {
            vm.subItems[item] = !vm.subItems[item];
            console.log(vm.subItems[item]);
        }
        

        //Function send data analytics

        function clicItemDash(item){
            Analytics.organizerEvents.dashboardOrgItems(item);
        }

        function _setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }
            angular.extend(vm.strings, {
                SECTION_PROFILE: "Perfil",
                SECTION_ACCOUNT: "Cuenta",
                SECTION_ACCOUNT_SETTINGS: "Ajustes",
                SECTION_ACCOUNT_BANK: "Información Bancaria",
                SECTION_ACTIVITIES: "Actividades",
                SECTION_ACTIVITIES_OPENED: "Abiertas",
                SECTION_ACTIVITIES_CLOSED: "Cerradas",
                SECTION_ACTIVITIES_INACTIVES: "Inactivas",
                SECTION_INSTRUCTORS: "Instructores",
                SECTION_REVIEWS: "Comentarios",
                SECTION_REVIEWS_PENDING: "Sin Revisar",
                SECTION_REVIEWS_DONE: "Done",
                SECTION_TRANSACTIONS: "Transacciones",
                SECTION_TRANSACTIONS_SALES: "Ventas",
                SECTION_MESSAGES: "Mensajes",
                ACCOUNT_ITEMS: 'account',
                ACTIVITIES_ITEMS: 'activities',
                REVIEWS_ITEMS: 'reviews',
                TRANSACTIONS_ITEMS: 'transactions',
                
            });
        }

        function _initScroll(){
            $scope.$on('scrolled',
              function(scrolled, scroll){
                vm.scroll = scroll;
                $scope.$apply();
              }
            );
        }

        function _activate() {
            _setStrings();
            _initScroll();
            vm.subItems ={
                activities: false,
                account: false,
                reviews: false,
                transactions: false
            }
        }

    }

})();
