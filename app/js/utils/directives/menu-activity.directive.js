(function () {
  'use strict';

  angular
    .module('trulii.utils.directives')
    .directive('menuActivity',menuActivity);

    menuActivity.$inject = ['$timeout'];

    function menuActivity($timeout){

        return {
            restrict: 'A',
            link: function($scope, element) {
                var ctrlFooter = false;
                var positionStyle = 'absolute';
                var valuePosition = '0px';
                angular.element(document).ready(function () {
                    $scope.$on('scrolled',
                    function(scrolled, scroll){
                        var sideBarPosition = (document.getElementsByClassName('sidebar-edit-activity')[0].getBoundingClientRect().top + window.scrollY) ;
                        var footerPosition = document.getElementsByClassName('container-fluid')[0].offsetHeight +80 ;
                        var coverPosition = (document.getElementsByClassName('cover-edit-activity')[0].getBoundingClientRect().top + window.scrollY) + document.getElementsByClassName('cover-edit-activity')[0].offsetHeight;
                        var navBarHeight = document.getElementsByClassName('navbar')[0].offsetHeight;
                        var sidebarTop =  document.getElementsByClassName('sidebar-edit-activity')[0].getBoundingClientRect().top - navBarHeight;
                        var positionToFixed = window.scrollY +  document.getElementsByClassName('sidebar-edit-activity')[0].offsetHeight;
                        console.log(sidebarTop); 
                        if(sidebarTop <= 20){
                            if(sideBarPosition <= coverPosition){
                                positionStyle = 'absolute';
                                valuePosition = '0px';
                                ctrlFooter = false;
                            }else{
                                if( positionToFixed >= footerPosition ){
                                    positionStyle = 'absolute';
                                    valuePosition = footerPosition-document.getElementsByClassName('sidebar-edit-activity')[0].offsetHeight-180+'px';
                                    ctrlFooter = true;
                                }else{
                                    positionStyle = 'fixed';
                                    valuePosition = '90px';
                                }
                            }  
                        }else{
                        if( positionToFixed <= footerPosition && ctrlFooter){
                                positionStyle = 'fixed';
                                valuePosition = '90px';
                            }
                        
                        }
                        document.getElementsByClassName('sidebar-edit-activity')[0].style.position = positionStyle;
                        document.getElementsByClassName('sidebar-edit-activity')[0].style.top = valuePosition;
                        $scope.$apply();
                    }
                    );
                });
            }
        };

    }


})();
