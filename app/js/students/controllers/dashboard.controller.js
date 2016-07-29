/**
 * @ngdoc controller
 * @name trulii.students.controllers.StudentDashboardCtrl
 * @description Handles Student Dashboard Main Component
 * @requires ui.router.state.$state
 */

(function () {
    'use strict';

    angular
        .module('trulii.students.controllers')
        .controller('StudentDashboardCtrl', StudentDashboardCtrl);

    StudentDashboardCtrl.$inject = ['$state', '$scope', 'Analytics', 'serverConf', 'cities', 'student', 'messages'];

    function StudentDashboardCtrl($state, $scope, Analytics, serverConf, cities, student, messages) {

        var vm = this;
        angular.extend(vm, {
            changeState : _changeState,
            isActive : isActive,
            scroll: 0,
            showSidebar: false,
            toggleSidebar: toggleSidebar,
            clickItem:clickItem,
            getAmazonUrl: getAmazonUrl,
            unreadNotificationsCount: messages.unread_messages,
            subItems: {},
            showSubItems: showSubItems,
            hideSubItems:hideSubItems,
        });

        _activate();

        //--------- Exposed Functions ---------//

        function isActive(stateStr){
            return $state.includes(stateStr);
        }
        
        function getAmazonUrl(file){
            return  serverConf.s3URL + '/' +  file;
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
        
        //--------- Internal Functions ---------//

        function _changeState(newState) {
            $state.go(newState);
        }

        function toggleSidebar(){
            vm.showSidebar = !vm.showSidebar;
        }

        function clickItem(item){
            Analytics.studentEvents.dashboardItemClicks(item);
        }

        function setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }
            angular.extend(vm.strings, {
                SECTION_ACTIVITIES: "Actividades",
                SECTION_ACTIVITIES_CURRENT: "Actuales",
                SECTION_ACTIVITIES_NEXT: "Próximas",
                SECTION_ACTIVITIES_LAST: "Por revisar",
                SECTION_ACCOUNT: "Cuenta",
                SECTION_PROFILE: "Perfil",
                SECTION_HISTORY: "Transacciones",
                SECTION_WISHLIST: "Favoritos",
                SECTION_NOTIFICATIONS: "Notificaciones",
                ACTIVITIES_ITEMS: 'activities',
                
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
        function _initNotificationWatch(){
          $scope.$on('update_notifications',
            function(){
              student.getMessages().then(function(data){
                vm.unreadNotificationsCount = data.unread_messages;
              });
            }
          );
        }

        
        function _activate() {
            setStrings();
            _initNotificationWatch();
            _initWidget();
             vm.subItems ={
                activities: false
            }
            
            //Function for angularSeo
            $scope.htmlReady();
        }
    }

})();
