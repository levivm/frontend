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

    OrganizerDashboardCtrl.$inject = ['$state', '$scope', '$window', 'unreadReviewsCount', 'Analytics', 'serverConf', 'organizer'];
    function OrganizerDashboardCtrl($state, $scope, $window, unreadReviewsCount, Analytics, serverConf, organizer) {

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
            hideSubItems:hideSubItems,
            titleActive: ''
        });


        _activate();

        function getAmazonUrl(file){
            return  serverConf.s3URL + '/' +  file;
        }
        
        function isActive(stateStr){
            return $state.includes(stateStr);
        }

        function toggleSidebar(){
            vm.showSidebar = !vm.showSidebar;
        }
        
        function  showSubItems(item) {
            vm.subItems[item] = !vm.subItems[item];
        }
        
        function hideSubItems(subItem) {
            angular.forEach(vm.subItems, function(value, item){
                if(item!==subItem)
                    vm.subItems[item] = false;  
            });    
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
                SECTION_ACTIVITIES_OPENED: "Publicadas",
                SECTION_ACTIVITIES_CLOSED: "Cerradas",
                SECTION_ACTIVITIES_INACTIVES: "Inactivas",
                SECTION_INSTRUCTORS: "Instructores",
                SECTION_REVIEWS: "Comentarios",
                SECTION_REVIEWS_PENDING: "Sin Revisar",
                SECTION_REVIEWS_DONE: "Revisados",
                SECTION_TRANSACTIONS: "Transacciones",
                SECTION_TRANSACTIONS_SALES: "Ventas",
                SECTION_TRANSACTIONS_BALANCE: "Balance",
                SECTION_TRANSACTIONS_WITHDRAWALS: "Historial de Retiros",
                SECTION_MESSAGES: "Mensajes",
                ACCOUNT_ITEMS: 'account',
                ACTIVITIES_ITEMS: 'activities',
                REVIEWS_ITEMS: 'reviews',
                TRANSACTIONS_ITEMS: 'transactions',
                
            });
        }
          function _initWidget(){
            angular.element(document).ready(function () {
                $scope.$on('scrolled',
                  function(scrolled, scroll){
                    var sideBarPosition = (document.getElementsByClassName('sidebar-organizer')[0].getBoundingClientRect().top + window.scrollY) + document.getElementsByClassName('sidebar-organizer')[0].offsetHeight;
                    var footerPosition = document.getElementsByClassName('container-fluid')[0].offsetHeight - 80 ;
                    vm.scroll = scroll;
                    var positionToFixed = window.scrollY +  document.getElementsByClassName('sidebar-organizer')[0].offsetHeight;
                    if( positionToFixed >= footerPosition ){
                         document.getElementsByClassName('sidebar-organizer')[0].style.position = 'absolute';
                         document.getElementsByClassName('sidebar-organizer')[0].style.top =  footerPosition-document.getElementsByClassName('sidebar-organizer')[0].offsetHeight+'px';
                       
                    }else{
                        document.getElementsByClassName('sidebar-organizer')[0].style.position = 'fixed';
                        document.getElementsByClassName('sidebar-organizer')[0].style.top = '90px';
                    }
                    
                    $scope.$apply();
                  }
                );
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
        
        function _initNotificationWatch(){
          $scope.$on('update_reviews',
            function(){
              organizer.getReviews(1, 6, 'unread').then(function(data){
                vm.unreadReviewsCount = data.count;
              });
            }
          );
        }

        

        function _activate() {
            _setStrings();
            //_initScroll();
            _initWidget();
            _initNotificationWatch();
            vm.subItems ={
                activities: false,
                account: false,
                reviews: false,
                transactions: false
            }
            
            //Function for angularSeo
            $scope.htmlReady();
        }

    }

})();
